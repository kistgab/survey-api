import AddSurveyRepository from "@src/data/protocols/db/survey/add-survey-repository";
import { mockSurveyRepository } from "@src/data/test/mock-db-survey";
import DbAddSurvey from "@src/data/usecases/survey/add-survey/db-add-survey";
import { mockInputAddSurveyDto } from "@src/domain/test/mock-survey";
import * as Mockdate from "mockdate";

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
};

function createSut(): SutTypes {
  const addSurveyRepositoryStub = mockSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return {
    sut,
    addSurveyRepositoryStub,
  };
}

describe("DbAddSurvey", () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  afterAll(() => {
    Mockdate.reset();
  });

  it("should call AddSurveyRepository with correct values", async () => {
    const { sut, addSurveyRepositoryStub } = createSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add");
    const input = mockInputAddSurveyDto();

    await sut.add(input);

    expect(addSpy).toHaveBeenCalledWith({ ...input, date: new Date() });
  });

  it("should throw when AddSurveyRepository throws", async () => {
    const { sut, addSurveyRepositoryStub } = createSut();
    jest
      .spyOn(addSurveyRepositoryStub, "add")
      .mockReturnValueOnce(Promise.reject(new Error("Repository error")));

    await expect(sut.add(mockInputAddSurveyDto())).rejects.toThrow(new Error("Repository error"));
  });
});
