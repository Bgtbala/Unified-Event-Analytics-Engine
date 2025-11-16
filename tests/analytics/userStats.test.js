import request from "supertest";
const app = (await import("../../src/app.js")).default;


let apiKey = "";

beforeAll(async () => {
  const reg = await request(app)
    .post("/api/auth/register")
    .send({
      name: "User Stats App",
      domain: "https://example.com"
    });

  apiKey = reg.body.data.apiKey;

  // Create sample events
  await request(app)
    .post("/api/analytics/collect")
    .set("x-api-key", apiKey)
    .send({
      event: "view",
      userId: "user123",
      device: "mobile",
      metadata: { browser: "Chrome" },
      ipAddress: "192.168.0.1",
    });
});

describe("GET /api/analytics/user-stats", () => {
  it("should return stats for a user", async () => {
    const res = await request(app)
      .get("/api/analytics/user-stats?userId=user123")
      .set("x-api-key", apiKey);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalEvents).toBeGreaterThan(0);
    expect(res.body.data.userId).toBe("user123");
  });
});
