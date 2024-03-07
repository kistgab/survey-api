import { FindSurveyByIdRepository } from "@src/data/protocols/db/survey/find-by-id-surveys-repository";
import { mockFindSurveyByIdRepository } from "@src/data/test/mock-db-survey";
import { DbListSurveyById } from "@src/data/usecases/survey/list-survey-by-id/db-list-survey-by-id";
import { mockSurveyModel } from "@src/domain/test/mock-survey";
import * as Mockdate from "mockdate";
import { ListSurveyById } from "../../../../domain/usecases/survey/list-survey-by-id";

type SutTypes = {
  sut: ListSurveyById;
  findSurveyByIdRepositoryStub: FindSurveyByIdRepository;
};

function createSut(): SutTypes {
  const findSurveyByIdRepositoryStub = mockFindSurveyByIdRepository();
  const sut = new DbListSurveyById(findSurveyByIdRepositoryStub);

  return {
    sut,
    findSurveyByIdRepositoryStub,
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
    const { sut, findSurveyByIdRepositoryStub } = createSut();
    const findByIdSpy = jest.spyOn(findSurveyByIdRepositoryStub, "findById");

    await sut.list("any_id");

    expect(findByIdSpy).toHaveBeenCalledTimes(1);
  });

  it("should return a survey on success", async () => {
    const { sut } = createSut();

    const result = await sut.list("any_id");

    expect(result).toEqual(mockSurveyModel());
  });

  it("should return null when repository returns null", async () => {
    const { sut, findSurveyByIdRepositoryStub } = createSut();
    jest.spyOn(findSurveyByIdRepositoryStub, "findById").mockReturnValueOnce(Promise.resolve(null));

    const result = await sut.list("any_id");

    expect(result).toBeNull();
  });

  it("should throw if FindAllSurveysRepository throws", async () => {
    const { sut, findSurveyByIdRepositoryStub } = createSut();
    jest
      .spyOn(findSurveyByIdRepositoryStub, "findById")
      .mockReturnValueOnce(Promise.reject(new Error("Repository error")));

    await expect(sut.list("any_id")).rejects.toThrow("Repository error");
  });
});
