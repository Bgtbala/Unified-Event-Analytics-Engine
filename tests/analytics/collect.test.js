import request from "supertest";
const app = (await import("../../src/app.js")).default;

let apiKey = "";

beforeAll(async () => {
  // create app to get API key
  const reg = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test Analytics App",
      domain: "https://example.com"
    });

  apiKey = reg.body.data.apiKey;
});

describe("POST /api/analytics/collect", () => {
  it("should collect a single event", async () => {
    const res = await request(app)
      .post("/api/analytics/collect")
      .set("x-api-key", apiKey)
      .send({
        event: "button_click",
        url: "https://example.com",
        device: "mobile",
        ipAddress: "192.168.1.1",
        metadata: { browser: "Chrome" }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should reject invalid event payload", async () => {
    const res = await request(app)
      .post("/api/analytics/collect")
      .set("x-api-key", apiKey)
      .send({}); // invalid

    expect(res.statusCode).toBe(400);
  });
});
