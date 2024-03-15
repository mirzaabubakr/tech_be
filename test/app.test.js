const request = require("supertest");
const app = require("../app.js");

jest.useFakeTimers();

let token = "";

describe("Login Endpoint", () => {
  it("should return a status code 200 on successful login", async () => {
    const response = await request(app)
      .get("/users")
      .send({ email: "user@example.com", password: "string" });

    expect(response.status).toBe(200);
    // expect(response.body.hasOwnProperty("token"));
    // token = `Bearer ${response?.body?.token}`;
  });
});
