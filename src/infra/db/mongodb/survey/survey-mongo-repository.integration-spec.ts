import { AccountModel } from "@src/data/models/account-model";
import { mockAddSurveyModel } from "@src/domain/test/mock-survey";
import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";
import { SurveyMongoRepository } from "@src/infra/db/mongodb/survey/survey-mongo-repository";
import * as Mockdate from "mockdate";
import { Collection, ObjectId } from "mongodb";

describe("Survey Mongo Repository", () => {
  let surveyCollection: Collection;
  let surveyAnswerCollection: Collection;
  let accountCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    Mockdate.set(new Date());
  });

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection("surveys");
    surveyAnswerCollection = MongoHelper.getCollection("surveyAnswers");
    accountCollection = MongoHelper.getCollection("accounts");
    await surveyCollection.deleteMany({});
    await surveyAnswerCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
    Mockdate.reset();
  });

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

  function createSut(): SurveyMongoRepository {
    return new SurveyMongoRepository();
  }

  describe("add", () => {
    it("should add a survey on success", async () => {
      const sut = createSut();
      const surveyToAdd = mockAddSurveyModel();
      surveyToAdd.answers.push({ answer: "any_answer" });

      await sut.add(surveyToAdd);

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
      const account = await createAccount();
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
      const result = await surveyCollection.insertMany([{ ...survey1 }, { ...survey2 }]);
      const surveyIdToAnswer = result.insertedIds[0];
      await surveyAnswerCollection.insertOne({
        surveyId: surveyIdToAnswer,
        accountId: new ObjectId(account.id),
        date: new Date(),
        answer: survey1.answers[0].answer,
      });
      const sut = createSut();
      const surveys = await sut.findAll(account.id);

      const { id: id1, ...firstReturnedSurveyWithoutId } = surveys[0];
      const { id: id2, ...secondReturnedSurveyWithoutId } = surveys[1];
      expect(surveys.length).toBe(2);
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(firstReturnedSurveyWithoutId).toEqual({ ...survey1, didAnswer: true });
      expect(secondReturnedSurveyWithoutId).toEqual({ ...survey2, didAnswer: false });
    });

    it("should return an empty list", async () => {
      const account = await createAccount();
      const sut = createSut();

      const surveys = await sut.findAll(account.id);

      expect(surveys.length).toBe(0);
    });
  });

  describe("findById", () => {
    it("should load survey by id on success", async () => {
      const surveyToAdd = mockAddSurveyModel();
      const insertResult = await surveyCollection.insertOne({ ...surveyToAdd });
      const sut = createSut();

      const survey = await sut.findById(insertResult.insertedId.toString());
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { id, ...surveyWithoutId } = survey!;

      expect(id).toBeDefined();
      expect(surveyWithoutId).toEqual(surveyToAdd);
    });

    it("should return null when there is no survey with the specified id", async () => {
      const sut = createSut();

      const anyId = "55153a8014829a865bbf700d";
      const survey = await sut.findById(anyId);

      expect(survey).toBeNull();
    });
  });
});
