import * as Mockdate from "mockdate";
import { SurveyModel } from "../../../../data/models/survey-model";
import { internalServerError, ok } from "../../../helpers/http/http-helper";
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
function createListSurveysStub(): ListSurveys {
  class ListSurveysStub implements ListSurveys {
    async list(): Promise<SurveyModel[]> {
      return Promise.resolve(createFakeSurveys());
    }
  }
  return new ListSurveysStub();
}

type SutTypes = {
  sut: ListSurveysController;
  listSurveysStub: ListSurveys;
};

function createSut(): SutTypes {
  const listSurveysStub = createListSurveysStub();
  const sut = new ListSurveysController(listSurveysStub);
  return {
    sut,
    listSurveysStub,
  };
}

describe("ListSurveys Controller", () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  afterAll(() => {
    Mockdate.reset();
  });

  it("should call ListSurveys", async () => {
    const { sut, listSurveysStub } = createSut();
    const listSpy = jest.spyOn(listSurveysStub, "list");

    await sut.handle({});

    expect(listSpy).toHaveBeenCalled();
  });

  it("should return 500 when ListSurveys throws", async () => {
    const { sut, listSurveysStub } = createSut();
    jest
      .spyOn(listSurveysStub, "list")
      .mockReturnValueOnce(Promise.reject(new Error("List surveys error")));

    const result = await sut.handle({});

    expect(result).toEqual(internalServerError(new Error("List surveys error")));
  });

  it("should return 200 on success", async () => {
    const { sut } = createSut();

    const result = await sut.handle({});

    expect(result).toEqual(ok(createFakeSurveys()));
  });
});
