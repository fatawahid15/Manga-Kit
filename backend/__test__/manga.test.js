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

  const profiles = [
    {
      username: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      UserId: 1,
    },
    {
      username: "user2",
      createdAt: new Date(),
      updatedAt: new Date(),
      UserId: 2,
    },
  ];

  const bookmark = [
    {
      bookmark: "e3b80007-4b9f-4889-937f-465a82595cce",
      UserId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const payload = { id: 1, email: "user1@gmail.com" };
  access_token = signToken(payload);

  await sequelize.queryInterface.bulkInsert("Users", users);
  await sequelize.queryInterface.bulkInsert("Profiles", profiles);
  await sequelize.queryInterface.bulkInsert("Bookmarks", bookmark);
});

afterAll(async () => {
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
  await sequelize.queryInterface.bulkDelete("Bookmarks", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("Manga API Endpoints", () => {
  describe("GET /manga", () => {
    it("Should return a list of mangas with pagination", async () => {
      const response = await request(app)
        .get("/manga")
        .set("Authorization", `Bearer ${access_token}`)
        .query({ search: "Naruto", page: 1, limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("mangas");
      expect(response.body.mangas.length).toBeGreaterThan(0);
    });
  });

  describe("GET /bookmark", () => {
    it("Should return a list of bookmarked mangas", async () => {
      const response = await request(app)
        .get("/bookmark")
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("mangas");
    });

    it("Should return 401 if no access_token provided", async () => {
      const response = await request(app).get("/bookmark");

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "You don't have the permission"
      );
    });
  });

  describe("POST /bookmark", () => {
    it("Should add a manga to the bookmarks", async () => {
      const response = await request(app)
        .post("/bookmark")
        .set("Authorization", `Bearer ${access_token}`)
        .send({ mangaId: "95d3a4dc-e888-4761-91e2-abf3a5a823f6" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("user");
    });

    it("Should return 400 if manga is already bookmarked", async () => {
      await request(app)
        .post("/bookmark")
        .set("Authorization", `Bearer ${access_token}`)
        .send({ mangaId: "95d3a4dc-e888-4761-91e2-abf3a5a823f6" });

      const response = await request(app)
        .post("/bookmark")
        .set("Authorization", `Bearer ${access_token}`)
        .send({ mangaId: "95d3a4dc-e888-4761-91e2-abf3a5a823f6" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Bookmark already exist");
    });
  });

  describe("DELETE /bookmark/:mangaId", () => {
    it("Should delete a bookmark successfully", async () => {
      const response = await request(app)
        .delete("/bookmark/e3b80007-4b9f-4889-937f-465a82595cce")
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Bookmark e3b80007-4b9f-4889-937f-465a82595cce deleted successfully"
      );
    });
  });

  describe("GET /manga/title/:mangaId", () => {
    it("Should return a manga by its ID", async () => {
      const response = await request(app)
        .get("/manga/title/95d3a4dc-e888-4761-91e2-abf3a5a823f6")
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("manga");
      expect(response.body.manga).toHaveProperty(
        "id",
        "95d3a4dc-e888-4761-91e2-abf3a5a823f6"
      );
    });
  });

  describe("GET /manga/title/:mangaId/chapters", () => {
    it("Should return chapters for a given manga", async () => {
      const response = await request(app)
        .get("/manga/title/95d3a4dc-e888-4761-91e2-abf3a5a823f6/chapters")
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("chapters");
      expect(response.body.chapters.length).toBeGreaterThan(0);
    });
  });

  describe("GET /manga/chapter/:chapterId", () => {
    it("Should return pages for a given chapter", async () => {
      const response = await request(app)
        .get("/manga/chapter/8f6ebaab-980a-49ce-ab1a-927ba1ad6a6b")
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("imgUrls");
      expect(response.body.imgUrls.length).toBeGreaterThan(0);
    });
  });
});
