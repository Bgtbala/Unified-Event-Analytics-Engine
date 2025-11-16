import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/config/redis.js", () => {
  const mock = {
    storage: {},

    // Basic commands
    get: jest.fn(async (key) => mock.storage[key] ?? null),
    set: jest.fn(async (key, value) => {
      mock.storage[key] = value;
      return "OK";
    }),
    setex: jest.fn(async (key, ttl, value) => {
      mock.storage[key] = value;
      return "OK";
    }),
    del: jest.fn(async (key) => {
      delete mock.storage[key];
      return 1;
    }),

    // needed for rate limiting
    incr: jest.fn(async (key) => {
    const expireAt = mock.storage[key + ":expire"];
    if (expireAt && expireAt < Date.now()) {
        mock.storage[key] = 0;
    }
    mock.storage[key] = (Number(mock.storage[key]) || 0) + 1;
    return mock.storage[key];
    }),
    expire: jest.fn(async (key, ttl) => {
    mock.storage[key + ":expire"] = Date.now() + ttl * 1000;
    return 1;
    }),


    // for older libs
    call: jest.fn(async (cmd, ...args) => {
      cmd = cmd.toUpperCase();
      if (cmd === "INCR") return mock.incr(args[0]);
      if (cmd === "EXPIRE") return mock.expire();
      return "OK";
    }),

    // ⭐ for `rate-limit-redis`
    sendCommand: jest.fn(async (command) => {
      const [cmd, key, ttl] = command.map(String);
      if (cmd.toUpperCase() === "INCR") return mock.incr(key);
      if (cmd.toUpperCase() === "EXPIRE") return mock.expire(key, ttl);
      return "OK";
    }),

    on: jest.fn(),
  };

  // Silence Redis logs during test runs
  console.error = () => {};
  console.log = () => {};

  return { default: mock };
});
