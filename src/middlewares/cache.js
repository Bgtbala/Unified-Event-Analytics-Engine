import redis from "../config/redis.js";

export const cache = (keyGenerator, ttl = 60) => {
  return async (req, res, next) => {
    try {
      const key = keyGenerator(req);

      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      // Override res.json to save response in cache
      const originalJson = res.json.bind(res);

      res.json = async (data) => {
        await redis.setex(key, ttl, JSON.stringify(data));
        return originalJson(data);
      };

      next();
    } catch (err) {
      next(err); // fallback gracefully
    }
  };
};
