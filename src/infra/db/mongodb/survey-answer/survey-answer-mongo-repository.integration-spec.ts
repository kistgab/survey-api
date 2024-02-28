import { AccountModel } from "@src/data/models/account-model";
import { SurveyModel } from "@src/data/models/survey-model";
import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";
import { SurveyAnswerMongoRepository } from "@src/infra/db/mongodb/survey-answer/survey-answer-mongo-repository";
import * as Mockdate from "mockdate";
import { Collection } from "mongodb";

describe("Survey Answer Mongo Repository", () => {
  let surveyCollection: Collection;
  // let surveyAnswerCollection: Collection;
  let accountCollection: Collection;

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
    // surveyAnswerCollection = MongoHelper.getCollection("surveyAnswers");
    accountCollection = MongoHelper.getCollection("accounts");
    await surveyCollection.deleteMany({});
  });

  function createSut(): SurveyAnswerMongoRepository {
    return new SurveyAnswerMongoRepository();
  }

  async function createSurvey(): Promise<SurveyModel> {
    const survey = await surveyCollection.insertOne({
      answers: [{ answer: "any_answer", image: "any_image" }],
      question: "any_question",
      date: new Date(),
    });
    const { insertedId } = survey;
    return {
      answers: [{ answer: "any_answer", image: "any_image" }],
      question: "any_question",
      date: new Date(),
      id: insertedId.toString(),
    };
  }

  async function createAccount(): Promise<AccountModel> {
    const account = await accountCollection.insertOne({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });
    const { insertedId } = account;
    return {
      id: insertedId.toString(),
      name: "any_name",
      email: "any_email",
      password: "any_password",
    };
  }

  describe("save", () => {
    it("should add a survey answer if it's new", async () => {
      const sut = createSut();
      const survey = await createSurvey();
      const account = await createAccount();

      const surveyAnswer = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const { id, ...surveyAnswerWithoutId } = surveyAnswer;
      expect(id).toBeDefined();
      expect(surveyAnswerWithoutId).toEqual({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
    });
  });
});
