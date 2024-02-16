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

  describe("findAll", () => {
    it("should load all surveys on success", async () => {
      const survey1 = {
        answers: [{ answer: "any_answer", image: "any_image" }],
        question: "any_question",
        date: new Date(),
      };
      const survey2 = {
        answers: [{ answer: "another_answer", image: "another_image" }],
        question: "another_question",
        date: new Date(),
      };
      await surveyCollection.insertMany([{ ...survey1 }, { ...survey2 }]);
      const sut = createSut();

      const surveys = await sut.findAll();

      const { id: id1, ...firstReturnedSurveyWithoutId } = surveys[0];
      const { id: id2, ...secondReturnedSurveyWithoutId } = surveys[1];
      expect(surveys.length).toBe(2);
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(firstReturnedSurveyWithoutId).toEqual(survey1);
      expect(secondReturnedSurveyWithoutId).toEqual(survey2);
    });
  });
});
