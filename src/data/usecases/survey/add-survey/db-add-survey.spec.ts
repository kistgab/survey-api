import AddSurveyRepository from "@src/data/protocols/db/survey/add-survey-repository";
import DbAddSurvey from "@src/data/usecases/survey/add-survey/db-add-survey";
import { InputAddSurveyDto } from "@src/domain/dtos/add-survey-dto";
import * as Mockdate from "mockdate";

function createFakeSurveyData(): InputAddSurveyDto {
  return {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
  };
}

function createSurveyRepositoryStub(): AddSurveyRepository {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(): Promise<void> {
      return Promise.resolve();
    }
  }
  return new AddSurveyRepositoryStub();
}

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
};

function createSut(): SutTypes {
  const addSurveyRepositoryStub = createSurveyRepositoryStub();
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
    const input = createFakeSurveyData();

    await sut.add(input);

    expect(addSpy).toHaveBeenCalledWith({ ...input, date: new Date() });
  });

  it("should throw when AddSurveyRepository throws", async () => {
    const { sut, addSurveyRepositoryStub } = createSut();
    jest
      .spyOn(addSurveyRepositoryStub, "add")
      .mockReturnValueOnce(Promise.reject(new Error("Repository error")));

    await expect(sut.add(createFakeSurveyData())).rejects.toThrow(new Error("Repository error"));
  });
});
