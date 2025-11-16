import request from "supertest";
const app = (await import("../../src/app.js")).default;


let apiKey = "";

beforeAll(async () => {
  const reg = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Rate Limit App",
      domain: "https://example.com"
    });

  apiKey = reg.body.data.apiKey;
});

describe("Rate limiting", () => {
  it("should block excessive event submissions", async () => {
    // Hit endpoint too many times
    for (let i = 0; i < 120; i++) {
      await request(app)
        .post("/api/analytics/collect")
        .set("x-api-key", apiKey)
        .send({ event: "spam", device: "mobile" });
    }

    // This call must be rate-limited
    const res = await request(app)
      .post("/api/analytics/collect")
      .set("x-api-key", apiKey)
      .send({ event: "spam2", device: "mobile" });

    expect(res.statusCode).toBe(429);
  });
});
