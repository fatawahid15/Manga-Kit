const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { hash } = require("../helpers/bcrypt");
beforeAll(async () => {
  const users = [
    {
      email: "user1@gmail.com",
      password: await hash("usergmail1"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: "user2@gmail.com",
      password: await hash("usergmail2"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await sequelize.queryInterface.bulkInsert("Users", users);
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("POST /login", () => {
  describe("Success cases", () => {
    it("Should login successfully and return an access_token", async () => {
      const response = await request(app).post("/user/login").send({
        email: "user2@gmail.com",
        password: "usergmail2",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
    });
  });

  describe("Failure cases", () => {
    it("Should fail when email/password is not provided", async () => {
      const response = await request(app).post("/user/login").send({
        email: "user2@gmail.com",
      });

      expect(response.status).toBe(401);
    });
  });
});

describe("POST /register", () => {
  describe("Success cases", () => {
    it("Should login successfully and return an access_token", async () => {
      const response = await request(app).post("/user/register").send({
        email: "user3@gmail.com",
        password: "usergmail3",
      });

      expect(response.status).toBe(200);
    });
  });

  describe("Failure cases", () => {
    it("Should fail when email/password is not provided", async () => {
      const response = await request(app).post("/user/register").send({
        email: "user3@gmail.com",
      });

      expect(response.status).toBe(401);
    });
  });
});
