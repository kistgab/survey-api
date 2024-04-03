import { mockSurveyModelList } from "@src/domain/test/mock-survey";
import { ListSurveys } from "@src/domain/usecases/survey/list-surveys";
import ListSurveysController from "@src/presentation/controllers/survey/list-surveys/list-surveys-controller";
import { internalServerError, noContent, ok } from "@src/presentation/helpers/http/http-helper";
import { HttpRequest } from "@src/presentation/protocols/http";
import { mockListSurveys } from "@src/presentation/test/mock-survey";
import * as Mockdate from "mockdate";

function createRequest(): HttpRequest {
  return {
    accountId: "any_account_id",
  };
}

type SutTypes = {
  sut: ListSurveysController;
  listSurveysStub: ListSurveys;
};

function createSut(): SutTypes {
  const listSurveysStub = mockListSurveys();
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

    await sut.handle(createRequest());

    expect(listSpy).toHaveBeenCalled();
  });

  it("should return 500 when ListSurveys throws", async () => {
    const { sut, listSurveysStub } = createSut();
    jest
      .spyOn(listSurveysStub, "list")
      .mockReturnValueOnce(Promise.reject(new Error("List surveys error")));

    const result = await sut.handle(createRequest());

    expect(result).toEqual(internalServerError(new Error("List surveys error")));
  });

  it("should return 200 on success", async () => {
    const { sut } = createSut();

    const result = await sut.handle(createRequest());

    expect(result).toEqual(ok(mockSurveyModelList()));
  });

  it("should return 204 on success with no data", async () => {
    const { sut, listSurveysStub } = createSut();
    jest.spyOn(listSurveysStub, "list").mockReturnValueOnce(Promise.resolve([]));

    const result = await sut.handle(createRequest());

    expect(result).toEqual(noContent());
  });
});
