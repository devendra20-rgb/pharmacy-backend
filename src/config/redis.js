let redis = null;

if (process.env.ENABLE_REDIS === "true") {
  const Redis = (await import("ioredis")).default;

  redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  });

  redis.on("connect", () => {
    console.log("✅ Redis connected");
  });
}

export default redis;
