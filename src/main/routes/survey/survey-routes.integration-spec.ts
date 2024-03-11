import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";
import { setupApp } from "@src/main/config/app";
import { Express } from "express";
import * as jwt from "jsonwebtoken";
import { Collection } from "mongodb";
import request from "supertest";

let surveyCollection: Collection;
let accountCollection: Collection;
let app: Express;

async function createAccessToken(): Promise<string> {
  const user = await accountCollection.insertOne({
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    role: "admin",
  });
  const insertedMongoId = user.insertedId;
  const accessToken = jwt.sign({ id: insertedMongoId.id }, process.env.JWT_SECRET);
  await accountCollection.updateOne(
    {
      _id: insertedMongoId,
    },
    { $set: { accessToken } },
  );
  return accessToken;
}

describe("Survey routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    app = setupApp();
    surveyCollection = MongoHelper.getCollection("surveys");
    accountCollection = MongoHelper.getCollection("accounts");
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe("POST /surveys", () => {
    it("should return 403 on adding survey without accessToken", async () => {
      const input = {
        question: "any_question",
        answers: [{ image: "any_image", answer: "any_answer" }, { answer: "other_answer" }],
      };
      await request(app).post("/api/surveys").send(input).expect(403);
    });

    it("should return 204 on adding survey with a valid accessToken", async () => {
      const input = {
        question: "any_question",
        answers: [{ image: "any_image", answer: "any_answer" }, { answer: "other_answer" }],
      };
      const accessToken = await createAccessToken();

      await request(app)
        .post("/api/surveys")
        .set("x-access-token", accessToken)
        .send(input)
        .expect(204);
    });
  });

  describe("GET /surveys", () => {
    it("should return 403 on listing surveys without accessToken", async () => {
      await request(app).get("/api/surveys").expect(403);
    });

    it("should return 200 on adding survey with a valid accessToken", async () => {
      await surveyCollection.insertOne({
        question: "any_question",
        answers: [{ image: "any_image", answer: "any_answer" }, { answer: "other_answer" }],
        date: new Date(),
      });
      const accessToken = await createAccessToken();

      await request(app).get("/api/surveys").set("x-access-token", accessToken).expect(200);
    });
  });
});
