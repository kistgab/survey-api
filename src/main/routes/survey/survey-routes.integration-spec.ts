import { Collection } from "mongodb";
import request from "supertest";
import { MongoHelper } from "../../../infra/db/mongodb/helpers/mongo-helper";
import app from "../../config/app";

describe("SignUp route", () => {
  let surveyCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
  });

  describe("POST /surveys", () => {
    it("should return 403 on adding survey without accessToken", async () => {
      const input = {
        question: "any_question",
        answers: [{ image: "any_image", answer: "any_answer" }, { answer: "other_answer" }],
      };
      await request(app).post("/api/surveys").send(input).expect(403);
    });
  });
});
