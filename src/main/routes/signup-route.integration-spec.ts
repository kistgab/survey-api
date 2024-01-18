import request from "supertest";
import app from "../config/app";

describe("SignUp route", () => {
  it("should return an account on success", async () => {
    const input = {
      email: "any_email@mail.com",
      name: "any_name",
      password: "any_password",
      passwordConfirmation: "any_password",
    };
    await request(app).post("/api/signup").send(input).expect(200);
  });
});
