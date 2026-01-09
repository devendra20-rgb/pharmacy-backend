import redis from "../config/redis.js";

const cache = (keyBuilder, ttl = 3600) => {
  return async (req, res, next) => {
    // 🔴 Redis disabled → skip cache
    if (!redis) return next();

    const key =
      typeof keyBuilder === "function"
        ? keyBuilder(req)
        : keyBuilder;

    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      redis.set(key, JSON.stringify(data), "EX", ttl);
      originalJson(data);
    };

    next();
  };
};

export default cache;
