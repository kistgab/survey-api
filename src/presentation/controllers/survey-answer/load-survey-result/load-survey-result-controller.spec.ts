import { LoadSurveyResultController } from "@src/presentation/controllers/survey-answer/load-survey-result/load-survey-result-controller";
import { unprocessableContent } from "@src/presentation/helpers/http/http-helper";
import { HttpRequest } from "@src/presentation/protocols/http";
import { mockListSurveyById } from "@src/presentation/test/mock-survey";

function createRequest(): HttpRequest<void, { surveyId: string }> {
  return {
    params: {
      surveyId: "any_id",
    },
  };
}

describe("LoadSurveyResultController", () => {
  it("should return 422 when no surveyId was provided", async () => {
    const listSurveyByIdStub = mockListSurveyById();
    const sut = new LoadSurveyResultController(listSurveyByIdStub);

    const result = await sut.handle({});

    expect(result).toEqual(unprocessableContent(new Error("surveyId is required")));
  });

  it("Should call LoadSurveyById with correct value  ", async () => {
    const listSurveyByIdStub = mockListSurveyById();
    const sut = new LoadSurveyResultController(listSurveyByIdStub);
    const listByIdSpy = jest.spyOn(listSurveyByIdStub, "list");

    await sut.handle(createRequest());

    expect(listByIdSpy).toHaveBeenCalledWith("any_id");
  });
});
