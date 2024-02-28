import { AccountModel } from "@src/data/models/account-model";
import { SurveyModel } from "@src/data/models/survey-model";
import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";
import { SurveyAnswerMongoRepository } from "@src/infra/db/mongodb/survey-answer/survey-answer-mongo-repository";
import * as Mockdate from "mockdate";
import { Collection } from "mongodb";

describe("Survey Answer Mongo Repository", () => {
  let surveyCollection: Collection;
  let surveyAnswerCollection: Collection;
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
    surveyAnswerCollection = MongoHelper.getCollection("surveyAnswers");
    accountCollection = MongoHelper.getCollection("accounts");
    await surveyCollection.deleteMany({});
  });

  function createSut(): SurveyAnswerMongoRepository {
    return new SurveyAnswerMongoRepository();
  }

  async function createSurvey(): Promise<SurveyModel> {
    const surveyAnswer = {
      answers: [
        { answer: "any_answer", image: "any_image" },
        { answer: "any_other_answer", image: "any_other_image" },
      ],
      question: "any_question",
      date: new Date(),
    };
    const res = await surveyCollection.insertOne(surveyAnswer);
    return {
      ...surveyAnswer,
      id: res.insertedId.toString(),
    };
  }

  async function createAccount(): Promise<AccountModel> {
    const account = {
      name: "any_name",
      email: "any_email",
      password: "any_password",
    };
    const res = await accountCollection.insertOne(account);
    return {
      id: res.insertedId.toString(),
      ...account,
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

    it("should update a survey answer if it's not new", async () => {
      const sut = createSut();
      const survey = await createSurvey();
      const account = await createAccount();
      const res = await surveyAnswerCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const surveyAnswer = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      const { id, ...surveyAnswerWithoutId } = surveyAnswer;
      expect(res.insertedId.toString()).toEqual(id);
      expect(surveyAnswerWithoutId).toEqual({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date(),
      });
    });
  });
});
