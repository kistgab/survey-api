import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";

describe("SignUp route", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await MongoHelper.getCollection("accounts").deleteMany({});
  });

  describe("POST /signup", () => {
    it("should return 200 on signup", async () => {
      const input = {
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      };
      await request(app).post("/api/signup").send(input).expect(200);
    });
  });
});
