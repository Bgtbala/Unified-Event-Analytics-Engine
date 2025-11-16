import request from "supertest";
const app = (await import("../../src/app.js")).default;


let originalKey = "";
let newKey = "";

beforeAll(async () => {
  const reg = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Regenerate App",
      domain: "https://example.com"
    });

  originalKey = reg.body.data.apiKey;
});

describe("POST /api/auth/regenerate", () => {
  it("should regenerate API key", async () => {
    const res = await request(app)
      .post("/api/auth/regenerate")
      .send({ apiKey: originalKey });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.newApiKey).toBeDefined();

    newKey = res.body.data.newApiKey;
  });

  it("should reject old key after regeneration", async () => {
    const res = await request(app)
      .post("/api/analytics/collect")
      .set("x-api-key", originalKey)
      .send({
        event: "old_key_test",
        device: "mobile",
      });

    expect(res.statusCode).toBe(401);
  });

  it("should allow new key", async () => {
    const res = await request(app)
      .post("/api/analytics/collect")
      .set("x-api-key", newKey)
      .send({
        event: "new_key_test",
        device: "mobile",
      });

    expect(res.statusCode).toBe(201);
  });
});
