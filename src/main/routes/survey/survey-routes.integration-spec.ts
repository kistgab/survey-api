import * as jwt from "jsonwebtoken";
import { Collection } from "mongodb";
import request from "supertest";
import { MongoHelper } from "../../../infra/db/mongodb/helpers/mongo-helper";
import app from "../../config/app";

describe("SignUp route", () => {
  let surveyCollection: Collection;
  let accountCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
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
      const input = {
        question: "any_question",
        answers: [{ image: "any_image", answer: "any_answer" }, { answer: "other_answer" }],
      };
      await request(app)
        .post("/api/surveys")
        .set("x-access-token", accessToken)
        .send(input)
        .expect(204);
    });
  });
});
