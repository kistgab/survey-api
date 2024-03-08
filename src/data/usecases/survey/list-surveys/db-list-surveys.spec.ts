import { FindAllSurveysRepository } from "@src/data/protocols/db/survey/find-all-surveys-repository";
import { mockFindAllSurveysRepository } from "@src/data/test/mock-db-survey";
import { DbListSurveys } from "@src/data/usecases/survey/list-surveys/db-list-surveys";
import { mockSurveyModelList } from "@src/domain/test/mock-survey";
import * as Mockdate from "mockdate";

type SutTypes = {
  sut: DbListSurveys;
  findAllSurveysRepositoryStub: FindAllSurveysRepository;
};

function createSut(): SutTypes {
  const findAllSurveysRepositoryStub = mockFindAllSurveysRepository();
  const sut = new DbListSurveys(findAllSurveysRepositoryStub);

  return {
    sut,
    findAllSurveysRepositoryStub,
  };
}

describe("DbListSurveys UseCase", () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  afterAll(() => {
    Mockdate.reset();
  });

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

  it("should return a list of surveys on success", async () => {
    const { sut } = createSut();

    const result = await sut.list();

    expect(result).toEqual(mockSurveyModelList());
  });
});
