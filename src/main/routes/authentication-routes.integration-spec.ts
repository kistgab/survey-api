import { hash } from "bcrypt";
import { Collection } from "mongodb";
import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";

describe("SignUp route", () => {
  let accountCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
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

  describe("POST /login", () => {
    it("should return 200 on signup", async () => {
      const hashedPassword = await hash("any_password", 12);
      await accountCollection.insertOne({
        email: "any_email@mail.com",
        name: "any_name",
        password: hashedPassword,
      });
      const input = {
        email: "any_email@mail.com",
        password: "any_password",
      };
      await request(app).post("/api/login").send(input).expect(200);
    });
  });
});
