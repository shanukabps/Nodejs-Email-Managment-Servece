const request = require("supertest");
const { Email } = require("../../models/email");
let server;

desribe("GET /v1/emails", () => {
  beforeEach(() => {
    server = require("../../server");
  });
  afterEach(() => {
    server.close();
  });

  decribe("/v1/emails/:id", () => {
    it("should return a email status and id  if valid id is passed", async () => {
      const id = "a2bd4cd8-66df-44c1-aeeb-ce5093cbbf77";

      const res = await request(server).get("/api/genres/" + id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status", "QUEUED");
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id exists", async () => {
      const id = "1234";
      const res = await request(server).get("/api/emails/" + id);

      expect(res.status).toBe(404);
    });
  });
});
