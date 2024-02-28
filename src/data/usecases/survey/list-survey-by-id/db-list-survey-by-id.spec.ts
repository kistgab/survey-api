import { SurveyModel } from "@src/data/models/survey-model";
import { FindByIdSurveysRepository } from "@src/data/protocols/db/survey/find-by-id-surveys-repository";
import { DbListSurveyById } from "@src/data/usecases/survey/list-survey-by-id/db-list-survey-by-id";
import * as Mockdate from "mockdate";
import { ListSurveyById } from "../../../../domain/usecases/list-survey-by-id";

function createFakeSurvey(): SurveyModel {
  return {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
    id: "any_id",
  };
}

function createFindByIdSurveysRepositoryStub(): FindByIdSurveysRepository {
  class FindByIdSurveysRepositoryStub implements FindByIdSurveysRepository {
    async findById(): Promise<SurveyModel> {
      return Promise.resolve(createFakeSurvey());
    }
  }
  return new FindByIdSurveysRepositoryStub();
}

type SutTypes = {
  sut: ListSurveyById;
  findByIdSurveysRepositoryStub: FindByIdSurveysRepository;
};

function createSut(): SutTypes {
  const findByIdSurveysRepositoryStub = createFindByIdSurveysRepositoryStub();
  const sut = new DbListSurveyById(findByIdSurveysRepositoryStub);

  return {
    sut,
    findByIdSurveysRepositoryStub,
  };
}

describe("DbListSurveyById UseCase", () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  afterAll(() => {
    Mockdate.reset();
  });

  it("should call FindByIdSurveysRepository", async () => {
    const { sut, findByIdSurveysRepositoryStub } = createSut();
    const findByIdSpy = jest.spyOn(findByIdSurveysRepositoryStub, "findById");

    await sut.list("any_id");

    expect(findByIdSpy).toHaveBeenCalledTimes(1);
  });

  it("should return a survey on success", async () => {
    const { sut } = createSut();

    const result = await sut.list("any_id");

    expect(result).toEqual(createFakeSurvey());
  });

  it("should throw if FindAllSurveysRepository throws", async () => {
    const { sut, findByIdSurveysRepositoryStub } = createSut();
    jest
      .spyOn(findByIdSurveysRepositoryStub, "findById")
      .mockReturnValueOnce(Promise.reject(new Error("Repository error")));

    await expect(sut.list("any_id")).rejects.toThrow("Repository error");
  });
});
