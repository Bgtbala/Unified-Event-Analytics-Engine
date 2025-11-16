import request from "supertest";
const app = (await import("../../src/app.js")).default;


describe("Invalid API Key test", () => {
  it("should reject missing API key", async () => {
    const res = await request(app)
      .post("/api/analytics/collect")
      .send({ event: "x" });

    expect(res.statusCode).toBe(401);
  });

  it("should reject invalid API key", async () => {
    const res = await request(app)
      .post("/api/analytics/collect")
      .set("x-api-key", "invalid_key_123")
      .send({ event: "x" });

    expect(res.statusCode).toBe(401);
  });
});
