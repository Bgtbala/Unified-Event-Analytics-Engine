import request from "supertest";
const app = (await import("../../src/app.js")).default;
 // since app.js exports app

describe("POST /api/auth/register", () => {
  it("should register a new app and return an API key", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test App",
        domain: "https://example.com",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.apiKey).toBeDefined();
  });

  it("should fail when missing required fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({}); // missing values

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
