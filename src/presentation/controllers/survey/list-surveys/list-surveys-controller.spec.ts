import * as Mockdate from "mockdate";
import { SurveyModel } from "../../../../data/models/survey-model";
import { ListSurveys } from "./../../../../domain/usecases/list-surveys";
import ListSurveysController from "./list-surveys-controller";

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
  ];
}

describe("ListSurveys Controller", () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  afterAll(() => {
    Mockdate.reset();
  });

  it("should call ListSurveys", async () => {
    class ListSurveysStub implements ListSurveys {
      async list(): Promise<SurveyModel[]> {
        return Promise.resolve(createFakeSurveys());
      }
    }
    const listSurveysStub = new ListSurveysStub();
    const listSpy = jest.spyOn(listSurveysStub, "list");
    const sut = new ListSurveysController(listSurveysStub);

    await sut.handle({});

    expect(listSpy).toHaveBeenCalled();
  });
});
