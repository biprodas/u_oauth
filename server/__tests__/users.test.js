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

describe("GET /api/users", () => {
  test("should return status 401 if refresh_token is expired or revoked", async () => {
    const res = await request(app).get("/api/users");
    // expect(res.body.length).toBe(3);
    // const [user] = res.body;
    // expect(user).toHaveProperty("id");
    // expect(user).toHaveProperty("name");
    // expect(user).toHaveProperty("username");
    // expect(user).toHaveProperty("password");
    expect(res.statusCode).toBe(401);
  });
});

