// src/middlewares/apiKeyAuth.js
import ApiKey from "../models/ApiKey.js";
import App from "../models/App.js";
import { ApiError } from "../utils/ApiError.js";
import { hashApiKey } from "../utils/apiKey.js";

export const apiKeyAuth = async (req, res, next) => {
  try {
    const rawHeader =
      req.header("x-api-key") ||
      req.header("authorization") ||
      "";

    const token = rawHeader.startsWith("ApiKey ")
      ? rawHeader.replace("ApiKey ", "")
      : rawHeader;

    if (!token) {
      throw new ApiError(401, "API key missing");
    }

    // Hash token for lookup
    const hashed = hashApiKey(token);

    const apiKey = await ApiKey.findOne({ keyHash: hashed });

    if (!apiKey) {
      throw new ApiError(401, "Invalid API key");
    }
    if (apiKey.revoked) {
      throw new ApiError(401, "API key has been revoked");
    }
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      throw new ApiError(401, "API key expired");
    }

    const app = await App.findById(apiKey.app);
    if (!app) {
      throw new ApiError(404, "App not found for API key");
    }

    // Attach for controller use
    req.apiKey = apiKey;
    req.app = app;
    req.appId = app._id?.toString();

    next();
  } catch (err) {
    next(err);
  }
};

export default apiKeyAuth;
