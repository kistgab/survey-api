import LogErrorRepository from "@src/data/protocols/db/log/log-error-repository";
import { mockLogErrorRepository } from "@src/data/test/mock-db-log";
import LogControllerDecorator from "@src/main/decorators/log-controller/log-controller-decorator";
import ServerError from "@src/presentation/errors/server-error";
import { internalServerError } from "@src/presentation/helpers/http/http-helper";
import Controller from "@src/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http";

function createFakeRequest(): HttpRequest<string> {
  return {
    body: "any_body",
  };
}

function createFakeServerError(): HttpResponse<ServerError> {
  const fakeError = new Error();
  fakeError.stack = "any_stack";
  return internalServerError(fakeError);
}

function createControllerStub(): Controller<string, string> {
  class ControllerStub implements Controller<string, string> {
    async handle(httpRequest: HttpRequest<string>): Promise<HttpResponse<string>> {
      await Promise.resolve(httpRequest);
      return { body: "any_response", statusCode: 200 };
    }
  }
  return new ControllerStub();
}

type SutTypes = {
  sut: LogControllerDecorator<string, string>;
  controllerStub: Controller<string, string | Error>;
  logErrorRepositoryStub: LogErrorRepository;
};

function createSut(): SutTypes {
  const controllerStub = createControllerStub();
  const logErrorRepositoryStub = mockLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);
  return { sut, controllerStub, logErrorRepositoryStub };
}

describe("LogControllerDecorator", () => {
  it("should call the provided controller handle method", async () => {
    const { sut, controllerStub } = createSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");

    await sut.handle(createFakeRequest());

    expect(handleSpy).toHaveBeenCalledWith(createFakeRequest());
  });

  it("should return the same thing as the provided controller does", async () => {
    const { sut, controllerStub } = createSut();

    const controllerStubResponse = await controllerStub.handle(createFakeRequest());
    const sutResponse = await sut.handle(createFakeRequest());

    expect(sutResponse).toEqual(controllerStubResponse);
  });

  it("should call LogErrorRepository if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = createSut();
    const fakeServerError = createFakeServerError();
    jest.spyOn(controllerStub, "handle").mockReturnValueOnce(Promise.resolve(fakeServerError));
    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");

    await sut.handle(createFakeRequest());

    expect(logSpy).toHaveBeenCalledWith("any_stack");
  });
});
