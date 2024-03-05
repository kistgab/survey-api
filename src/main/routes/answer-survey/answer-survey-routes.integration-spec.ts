import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";
import app from "@src/main/config/app";
import request from "supertest";

describe("AnswerSurvey routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
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
  });
});
