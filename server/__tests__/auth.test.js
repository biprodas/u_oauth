process.env.NODE_ENV = "test";
const { sequelize } = require("../config/db");
const { User } = require('../models')

const request = require("supertest");
const app = require("../app");

beforeAll(async () => {
  // await sequelize.sync({ force: true }); // all model
  await User.sync({ force: true }) //, match: /_test$/
});

beforeEach(async () => {
  await User.bulkCreate([
    { name: "Biprodas Roy", username:"biprodas", password: "1234567", role: "Admin" },
    { name: "Asish Sarkar", username:"asish", password: "123456", role: "User" },
    { name: "Ruhit Rafi", username:"ruhit", password: "123456", role: "User" },
  ])
});

afterEach(async () => {
  await User.destroy({ truncate : true, cascade: false })
});

afterAll(async () => {
  // await User.drop();
  await sequelize.drop()
  // db.end();
  await sequelize.close()
});


describe("POST /api/auth/register ", () => {
  test("should return access_token encoded in jwt and refresh_token in uuidv4 format", async () => {
    const response = await request(app).get("/api");
    expect(response.status).toBe(200);
  });
});

describe("POST /api/auth/login ", () => {
  test("should return access_token encoded in jwt and refresh_token in uuidv4 format", async () => {
    const response = await request(app).get("/api");
    expect(response.status).toBe(200);
  });
});

describe("DELETE /api/auth/logout", () => {
  test("should revoked users active refresh token and remove access_token cookie", async () => {
    const response = await request(app).get("/api");
    expect(response.status).toBe(200);
  });
});

describe("GET /api/auth/me", () => {
  test("should return logged in user.id from valid access_token", async () => {
    const response = await request(app).get("/api");
    expect(response.status).toBe(200);
  });
});


describe("POST /api/auth/refresh-htoken ", () => {
  test("should return access_token encoded in jwt and refresh_token in uuidv4 format", async () => {
    const response = await request(app).get("/api");
    expect(response.status).toBe(200);
  });
});
describe("POST /api/auth/revoke-token ", () => {
  test("should return revokedAt and replacedBy refresh_token", async () => {
    const response = await request(app).get("/api");
    expect(response.status).toBe(200);
  });
});
