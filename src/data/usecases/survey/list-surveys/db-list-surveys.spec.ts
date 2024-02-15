import { SurveyModel } from "../../../models/survey-model";
import { FindAllSurveysRepository } from "./../../../protocols/db/survey/find-all-surveys-repository";
import { DbListSurveys } from "./db-list-surveys";

function createFakeSurveys(): SurveyModel[] {
  return [
    {
      question: "any_question",
      answers: [
        {
          image: "any_image",
          answer: "any_answer",
        },
      ],
      date: new Date(),
      id: "any_id",
    },
    {
      question: "any_other_question",
      answers: [
        {
          image: "any_other_image",
          answer: "any_other_answer",
        },
      ],
      date: new Date(),
      id: "any_other_id",
    },
  ];
}

function createFindAllSurveysRepositoryStub(): FindAllSurveysRepository {
  class FindAllSurveysRepositoryStub implements FindAllSurveysRepository {
    async findAll(): Promise<SurveyModel[]> {
      return Promise.resolve(createFakeSurveys());
    }
  }
  return new FindAllSurveysRepositoryStub();
}

type SutTypes = {
  sut: DbListSurveys;
  findAllSurveysRepositoryStub: FindAllSurveysRepository;
};

function createSut(): SutTypes {
  const findAllSurveysRepositoryStub = createFindAllSurveysRepositoryStub();
  const sut = new DbListSurveys(findAllSurveysRepositoryStub);

  return {
    sut,
    findAllSurveysRepositoryStub,
  };
}

describe("DbListSurveys UseCase", () => {
  it("should call FindAllSurveysRepository", async () => {
    const { sut, findAllSurveysRepositoryStub } = createSut();
    const findAllSpy = jest.spyOn(findAllSurveysRepositoryStub, "findAll");

    await sut.list();

    expect(findAllSpy).toHaveBeenCalledTimes(1);
  });

  it("should throw if FindAllSurveysRepository throws", async () => {
    const { sut, findAllSurveysRepositoryStub } = createSut();
    jest
      .spyOn(findAllSurveysRepositoryStub, "findAll")
      .mockReturnValueOnce(Promise.reject(new Error("Repository error")));

    await expect(sut.list()).rejects.toThrow("Repository error");
  });
});
