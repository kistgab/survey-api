import { InputAddSurveyDto } from "./../../../domain/dtos/add-survey-dto";
import AddSurveyRepository from "./../../protocols/db/survey/add-survey-repository";
import DbAddSurvey from "./db-add-survey";

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

describe("DbAddSurvey", () => {
  it("should call AddSurveyRepository with correct values", async () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add(): Promise<void> {
        return Promise.resolve();
      }
    }
    const addSurveyRepositoryStub = new AddSurveyRepositoryStub();
    const sut = new DbAddSurvey(addSurveyRepositoryStub);
    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add");
    const input = createFakeSurveyData();

    await sut.add(input);

    expect(addSpy).toHaveBeenCalledWith(input);
  });
});
