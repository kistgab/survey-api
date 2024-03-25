import { SurveyResultModel } from "@src/data/models/survey-result-model";
import { mockSurveyResultModel } from "@src/domain/test/mock-survey";
import { LoadSurveyResult } from "@src/domain/usecases/survey-answer/load-survey-result";
import { LoadSurveyResultController } from "@src/presentation/controllers/survey-answer/load-survey-result/load-survey-result-controller";
import {
  internalServerError,
  unprocessableContent,
} from "@src/presentation/helpers/http/http-helper";
import { HttpRequest } from "@src/presentation/protocols/http";
import * as Mockdate from "mockdate";

function createRequest(): HttpRequest<void, { surveyId: string }> {
  return {
    params: {
      surveyId: "any_id",
    },
  };
}

function mockLoadSurveyResult(): LoadSurveyResult {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load(): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel());
    }
  }
  return new LoadSurveyResultStub();
}

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyResultStub: LoadSurveyResult;
};

function createSut(): SutTypes {
  const loadSurveyResultStub = mockLoadSurveyResult();
  const sut = new LoadSurveyResultController(loadSurveyResultStub);
  return {
    sut,
    loadSurveyResultStub,
  };
}

describe("LoadSurveyResultController", () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  afterAll(() => {
    Mockdate.reset();
  });

  it("should return 422 when no surveyId was provided", async () => {
    const { sut } = createSut();
    const result = await sut.handle({});

    expect(result).toEqual(unprocessableContent(new Error("surveyId is required")));
  });

  it("Should call LoadSurveyResult with correct value", async () => {
    const { sut, loadSurveyResultStub } = createSut();
    const loadSpy = jest.spyOn(loadSurveyResultStub, "load");

    await sut.handle(createRequest());

    expect(loadSpy).toHaveBeenCalledWith("any_id");
  });

  it("Should return 500 if LoadSurveyResult throws", async () => {
    const { sut, loadSurveyResultStub } = createSut();
    jest
      .spyOn(loadSurveyResultStub, "load")
      .mockReturnValueOnce(Promise.reject(new Error("any_error")));

    const result = await sut.handle(createRequest());

    expect(result).toEqual(internalServerError(new Error("any_error")));
  });

  it("Should return 422 if LoadSurveyResult returns null", async () => {
    const { sut, loadSurveyResultStub } = createSut();
    jest.spyOn(loadSurveyResultStub, "load").mockReturnValueOnce(Promise.resolve(null));

    const result = await sut.handle(createRequest());

    expect(result).toEqual(unprocessableContent(new Error("surveyId is invalid")));
  });

  it("Should return 200 on success", async () => {
    const { sut } = createSut();

    const result = (await sut.handle(createRequest())).body as SurveyResultModel;

    expect(result).toEqual(mockSurveyResultModel());
  });
});
