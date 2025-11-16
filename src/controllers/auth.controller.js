// src/controllers/auth.controller.js
import App from "../models/App.js";
import ApiKey from "../models/ApiKey.js";
import { hashApiKey, generateApiKeyPlain } from "../utils/apiKey.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Register new App + generate API Key
 */
export const registerApp = asyncHandler(async (req, res) => {
  // validation middleware sets req.validation.value
  const { value } = req.validation;
  const { name, domain } = value;

  // Create app
  const app = await App.create({ name, domain });

  // Generate API key
  const plainKey = generateApiKeyPlain();
  const hashed = hashApiKey(plainKey);

  await ApiKey.create({
    app: app._id,
    keyHash: hashed,
  });

  return res.status(201).json(
    ApiResponse.success(
      { appId: app._id, apiKey: plainKey },
      "App registered successfully"
    )
  );
});

/**
 * Regenerate API Key
 * - Accepts either { appId } OR { apiKey } (plain string)
 * - Returns { newApiKey }
 */
export const regenerateApiKey = asyncHandler(async (req, res) => {
  const { appId, apiKey } = req.body;

  let targetAppId = appId;

  // Allow regeneration using only apiKey
  if (!targetAppId) {
    if (!apiKey) {
      throw new ApiError(400, "appId or apiKey is required");
    }

    const hashedOld = hashApiKey(apiKey);
    const existingKey = await ApiKey.findOne({ keyHash: hashedOld });

    if (!existingKey) throw new ApiError(401, "Invalid API key");
    if (existingKey.revoked) throw new ApiError(401, "API key has been revoked");

    targetAppId = existingKey.app.toString();
  }

  const app = await App.findById(targetAppId);
  if (!app) throw new ApiError(404, "App not found");

  const newPlainKey = generateApiKeyPlain();
  const newHash = hashApiKey(newPlainKey);

  await ApiKey.updateMany({ app: targetAppId }, { revoked: true });

  await ApiKey.create({
    app: targetAppId,
    keyHash: newHash,
  });

  return res.status(200).json(
    ApiResponse.success(
      { newApiKey: newPlainKey },
      "New API key generated"
    )
  );
});


/**
 * Revoke API Key
 * - Accepts either { apiKeyId } or { apiKey } (plain)
 */
export const revokeApiKey = asyncHandler(async (req, res) => {
  const { apiKeyId, apiKey } = req.body;

  let query = {};

  if (apiKeyId) {
    query._id = apiKeyId;
  } else if (apiKey) {
    const hashed = hashApiKey(apiKey);
    query.keyHash = hashed;
  } else {
    throw new ApiError(400, "apiKey or apiKeyId is required");
  }

  const existing = await ApiKey.findOne(query);
  if (!existing) {
    throw new ApiError(404, "API key not found");
  }

  await ApiKey.updateOne(query, { revoked: true });

  return res
    .status(200)
    .json(ApiResponse.success(null, "API key revoked successfully"));
});
