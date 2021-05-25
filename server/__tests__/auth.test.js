process.env.NODE_ENV = "test";
const db = require("../db");
const { sequelize } = require("../config/db");
const { User } = require('../models')


const request = require("supertest");
const app = require("../app");

beforeAll(async () => {
  // await sequelize.sync({ force: true }); // all model
  await User.sync({ force: true }) //, match: /_test$/
});

beforeEach(async () => {
  // seed with some data
  // await db.query(`INSERT INTO users (name, username, password, role, status) VALUES 
  //   ('Biprodas Roy', 'biprodas', '$2a$10$p3xf0hzL5JSYVFBjeNuhOeGw7LJLxrx29zwOfigiSR.s.2SLmpJzm', 'Admin', 'Active'),
  //   ('Asish Sarkar', 'asish', '$2a$10$7sSQeiD/roWTdV0315fIxe8vAkPxs5.IjuyC4PxIZoghW/5zOI6ze', 'User', 'Active'),
  //   ('Ruhit Rafi', 'ruhit', '$2a$10$sotE2LaV6T4ihVQNL43dE.FxyDhhLZhLvF9j8G7FRUM6FdyTQeSmy', 'User', 'Active')
  // ;`);
  await User.bulkCreate([
    { name: "Biprodas Roy", username:"biprodas", password: "1234567", role: "Admin" },
    { name: "Asish Sarkar", username:"asish", password: "123456", role: "User" },
    { name: "Ruhit Rafi", username:"ruhit", password: "123456", role: "User" },
  ])
});

afterEach(async () => {
  await User.drop();
});

afterAll(async () => {
  await User.drop();
  // db.end();
  await sequelize.close()
});


describe("POST /api/auth/register ", () => {
  test("should respond if api is running", async () => {
    const response = await request(app).get("/api");
    expect(response.status).toBe(200);
  });
});

describe("POST /api/auth/login ", () => {
  test("should respond if api is running", async () => {
    const response = await request(app).get("/api");
    expect(response.status).toBe(200);
  });
});


// describe("GET /api/users", () => {
//   test("It should respond with an array of users", async () => {
//     const res = await request(app).get("/api/users");
//     expect(res.body.length).toBe(3);
//     const [user] = res.body;
//     expect(user).toHaveProperty("id");
//     expect(user).toHaveProperty("name");
//     expect(user).toHaveProperty("username");
//     expect(user).toHaveProperty("password");
//     expect(res.statusCode).toBe(200);
//   });
// });

