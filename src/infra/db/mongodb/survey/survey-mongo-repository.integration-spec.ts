import * as Mockdate from "mockdate";
import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { SurveyMongoRepository } from "./survey-mongo-repository";

describe("Survey Mongo Repository", () => {
  let surveyCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    Mockdate.set(new Date());
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
    Mockdate.reset();
  });

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
  });

  function createSut(): SurveyMongoRepository {
    return new SurveyMongoRepository();
  }

  describe("add", () => {
    it("should add a survey on success", async () => {
      const sut = createSut();

      await sut.add({
        answers: [{ answer: "any_answer", image: "any_image" }, { answer: "any_answer" }],
        question: "any_question",
        date: new Date(),
      });

      const survey = await surveyCollection.findOne({ question: "any_question" });
      expect(survey?._id).toBeDefined();
      expect(survey?.question).toBe("any_question");
      expect(survey?.answers).toEqual([
        { answer: "any_answer", image: "any_image" },
        { answer: "any_answer" },
      ]);
      expect(survey?.date).toEqual(new Date());
    });
  });
});
