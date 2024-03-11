import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";
import { setupApp } from "@src/main/config/app";
import { RequestAnswerSurvey } from "@src/presentation/controllers/survey-answer/answer-survey-controller";
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
describe("AnswerSurvey routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    app = setupApp();
    surveyCollection = MongoHelper.getCollection("surveys");
    accountCollection = MongoHelper.getCollection("accounts");
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe("PUT /surveys/:surveyId/answers", () => {
    it("should return 403 on adding survey without accessToken", async () => {
      const input = {
        answer: "any_answer",
      };
      await request(app).put("/api/surveys/any_id/answers").send(input).expect(403);
    });

    it("should return 200 on answer survey with success", async () => {
      const res = await surveyCollection.insertOne({
        question: "any_question",
        answers: [{ image: "any_image", answer: "any_answer" }, { answer: "other_answer" }],
        date: new Date(),
      });
      const input: RequestAnswerSurvey = {
        answer: "any_answer",
      };
      const accessToken = await createAccessToken();
      await request(app)
        .put(`/api/surveys/${res.insertedId.toString()}/answers`)
        .set("x-access-token", accessToken)
        .send(input)
        .expect(200);
    });
  });
});
