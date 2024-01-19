import Controller from "../../../presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "../../../presentation/protocols/http";
import LogControllerDecorator from "./log";

type SutTypes = {
  sut: LogControllerDecorator<string, string>;
  controllerStub: Controller<string, string>;
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

function createSut(): SutTypes {
  const controllerStub = createControllerStub();
  const sut = new LogControllerDecorator(controllerStub);
  return { sut, controllerStub };
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
});
