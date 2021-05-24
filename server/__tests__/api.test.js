process.env.NODE_ENV = "test";
const db = require("../db");

const request = require("supertest");

const app = require("../app");

describe("GET /api ", () => {
  test("should respond if api is running", async () => {
    const response = await request(app).get("/api");
    expect(response.status).toBe(200);
  });


});
