import crypto from "crypto";

const HMAC_SECRET = process.env.API_KEY_SECRET || "change_this_in_prod";

export const generateApiKeyPlain = () => {
  return crypto.randomBytes(36).toString("hex"); // 72 chars
};

export const hashApiKey = (token) => {
  return crypto.createHmac("sha256", HMAC_SECRET).update(token).digest("hex");
};
