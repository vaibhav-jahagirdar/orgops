
const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

describe("Auth - Register", () => {



it("should register a user successfully", async () => {
const res = await request(app)
.post("/auth/register")
.send({
email: "vaibhav989i9@gmail.com",
password: "vaibhav11",
name: "Test User"
});

expect(res.statusCode).toBe(201);
expect(res.body).toHaveProperty("access_token");
expect(res.body).toHaveProperty("user");

expect(res.headers["set-cookie"]).toBeDefined();
});

});
