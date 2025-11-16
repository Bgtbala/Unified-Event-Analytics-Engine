import request from "supertest";
const app = (await import("../../src/app.js")).default;


let apiKey = "";
let appId = "";

beforeAll(async () => {
  const reg = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Revoke Test",
      domain: "https://example.com"
    });

  apiKey = reg.body.data.apiKey;
  appId = reg.body.data.appId;
});

describe("POST /api/auth/revoke", () => {
  it("should revoke an API key successfully", async () => {
    const res = await request(app)
      .post("/api/auth/revoke")
      .send({ apiKey });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should reject revoked API key when collecting", async () => {
    const res = await request(app)
      .post("/api/analytics/collect")
      .set("x-api-key", apiKey)
      .send({
        event: "test_event",
        device: "mobile",
      });

    expect(res.statusCode).toBe(401);
  });
});
