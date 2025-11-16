import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../config/redis.js";

const isTest = process.env.NODE_ENV === "test";

// 🟢 In test mode: we MUST enforce low limits so tests can trigger 429
const TEST_LIMIT = 100;

const getStore = () => {
  if (isTest) return undefined; // Use in-memory store in tests
  return new RedisStore({
    sendCommand: (command) => redis.call(command[0], ...command.slice(1)),
  });
};

export const collectRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isTest ? TEST_LIMIT : 800,
  keyGenerator: (req, res) => req.apiKey?._id || ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
});

export const analyticsRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isTest ? TEST_LIMIT : 120,
  keyGenerator: (req, res) => req.apiKey?._id || ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
});
