import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config(); // Only affects local dev & tests

const redisUrl = process.env.REDIS_URL;

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // avoid crashes on slow networks
  enableReadyCheck: false,
});

redis.on("connect", () => {
  console.log(`✅ Redis connected → ${redisUrl}`);
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redis;
