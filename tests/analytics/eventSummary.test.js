import request from "supertest";
const app = (await import("../../src/app.js")).default;

let apiKey = "";

beforeAll(async () => {
  const reg = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Summary App",
      domain: "https://example.com"
    });

  apiKey = reg.body.data.apiKey;

  // Seed 2 events
  await request(app)
    .post("/api/analytics/collect")
    .set("x-api-key", apiKey)
    .send({
      event: "page_view",
      url: "https://example.com",
      device: "desktop",
      ipAddress: "1.1.1.1",
      metadata: { browser: "Firefox" }
    });
});

describe("GET /api/analytics/event-summary", () => {
  it("should return summary for event type", async () => {
    const res = await request(app)
      .get("/api/analytics/event-summary?event=page_view")
      .set("x-api-key", apiKey);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.event).toBe("page_view");
  });
});
