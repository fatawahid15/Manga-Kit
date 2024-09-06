const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { hash } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

let access_token;

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

  const profile = [
    {
      username: "user1",
      bio: "This is user1 bio",
      createdAt: new Date(),
      updatedAt: new Date(),
      UserId: 1,
    },
    {
      username: "user2",
      bio: "This is user2 bio",
      createdAt: new Date(),
      updatedAt: new Date(),
      UserId: 2,
    },
  ];

  const payload = {
    id: 1,
    email: "user1@gmail.com",
  };

  access_token = signToken(payload);

  // Insert data into the database
  await sequelize.queryInterface.bulkInsert("Users", users);
  await sequelize.queryInterface.bulkInsert("Profiles", profile);
});

afterAll(async () => {
  // Cleanup database after tests
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await sequelize.queryInterface.bulkDelete("Profiles", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("Profile Endpoints", () => {
  describe("GET /profile/me", () => {
    it("Should return the user's own profile", async () => {
      const response = await request(app)
        .get("/profile/me")
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.profile).toHaveProperty("username", "user1");
      expect(response.body.profile).toHaveProperty("bio", "This is user1 bio");
    });

    it("Should fail if no token is provided", async () => {
      const response = await request(app).get("/profile/me");

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "You don't have the permission"
      );
    });
  });

  describe("PUT /profile/me", () => {
    it("Should update the user's own profile", async () => {
      const response = await request(app)
        .put("/profile/me")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          username: "updatedUser1",
          bio: "Updated bio for user1",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.profile).toHaveProperty("username", "updatedUser1");
      expect(response.body.profile).toHaveProperty(
        "bio",
        "Updated bio for user1"
      );
    });

    it("Should fail if the user is not authenticated", async () => {
      const response = await request(app).put("/profile/me").send({
        username: "updatedUser1",
        bio: "Updated bio for user1",
      });

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "You don't have the permission"
      );
    });
  });

  describe("DELETE /profile/me/bio", () => {
    it("Should delete the user's bio", async () => {
      const response = await request(app)
        .delete("/profile/me/bio")
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.profile).toHaveProperty("bio", null);
    });
  });

  describe("DELETE /profile/me/img", () => {
    it("Should delete the user's profile image", async () => {
      const response = await request(app)
        .delete("/profile/me/img")
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.profile).toHaveProperty("imgUrl", null);
    });
  });

  describe("GET /profile/:id", () => {
    it("Should return the profile by ID", async () => {
      const response = await request(app)
        .get("/profile/1")
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.profile).toHaveProperty("username", "updatedUser1");
    });

    it("Should return 404 if profile is not found", async () => {
      const response = await request(app)
        .get("/profile/99")
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("message", "Profile not found");
    });
  });

  describe("GET /profile", () => {
    it("Should return all profiles", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.profiles.length).toBeGreaterThan(0);
    });
  });
});
