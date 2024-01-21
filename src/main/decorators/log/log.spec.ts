import LogErrorRepository from "../../../data/protocols/log-error-repository";
import { internalServerError } from "../../../presentation/helpers/http-helper";
import Controller from "../../../presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "../../../presentation/protocols/http";
import LogControllerDecorator from "./log";

type SutTypes = {
  sut: LogControllerDecorator<string, string>;
  controllerStub: Controller<string, string | Error>;
  logErrorRepositoryStub: LogErrorRepository;
};

function createControllerStub(): Controller<string, string> {
  class ControllerStub implements Controller<string, string> {
    async handle(httpRequest: HttpRequest<string>): Promise<HttpResponse<string>> {
      await Promise.resolve(httpRequest);
      return { body: "any_response", statusCode: 200 };
    }
  }
  return new ControllerStub();
}

function createLogErrorRepositoryStub(): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      await Promise.resolve(stack);
    }
  }
  return new LogErrorRepositoryStub();
}

function createSut(): SutTypes {
  const controllerStub = createControllerStub();
  const logErrorRepositoryStub = createLogErrorRepositoryStub();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);
  return { sut, controllerStub, logErrorRepositoryStub };
}

describe("LogControllerDecorator", () => {
  it("should call the provided controller handle method", async () => {
    const { sut, controllerStub } = createSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const input: HttpRequest<string> = {
      body: "any_body",
    };

    await sut.handle(input);

    expect(handleSpy).toHaveBeenCalledWith(input);
  });

  it("should return the same thing as the provided controller does", async () => {
    const { sut, controllerStub } = createSut();
    const input: HttpRequest<string> = {
      body: "any_body",
    };

    const controllerStubResponse = await controllerStub.handle(input);
    const sutResponse = await sut.handle(input);

    expect(sutResponse).toEqual(controllerStubResponse);
  });

  it("should call LogErrorRepository if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = createSut();
    const fakeError = new Error();
    fakeError.stack = "any_stack";
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(Promise.resolve(internalServerError(fakeError)));
    const input: HttpRequest<string> = {
      body: "any_body",
    };
    const logSpy = jest.spyOn(logErrorRepositoryStub, "log");

    await sut.handle(input);

    expect(logSpy).toHaveBeenCalledWith(fakeError.stack);
  });
});
