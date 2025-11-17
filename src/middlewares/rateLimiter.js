import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../config/redis.js";

const isTest = process.env.NODE_ENV === "test";
const isRender = process.env.RENDER === "true"; // 👈 Add this env on Render

// 🟢 Only use Redis if NOT test & NOT Render
const useRedis = !isTest && !isRender;

// 🟢 Test mode: low limits for testing
const TEST_LIMIT = 100;

const getStore = () => {
  if (!useRedis) return undefined; // fallback to memory
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
