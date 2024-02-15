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

describe("DbListSurveys UseCase", () => {
  it("should call FindAllSurveysRepository", async () => {
    class FindAllSurveysRepositoryStub implements FindAllSurveysRepository {
      async findAll(): Promise<SurveyModel[]> {
        return Promise.resolve(createFakeSurveys());
      }
    }
    const findAllSurveysRepositoryStub = new FindAllSurveysRepositoryStub();
    const findAllSpy = jest.spyOn(findAllSurveysRepositoryStub, "findAll");
    const sut = new DbListSurveys(findAllSurveysRepositoryStub);

    await sut.list();

    expect(findAllSpy).toHaveBeenCalledTimes(1);
  });
});
