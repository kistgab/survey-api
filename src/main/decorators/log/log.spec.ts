import Controller from "../../../presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "../../../presentation/protocols/http";
import LogControllerDecorator from "./log";

describe("LogControllerDecorator", () => {
  it("should call the provided controller handle method", async () => {
    class ControllerStub implements Controller<string, string> {
      async handle(httpRequest: HttpRequest<string>): Promise<HttpResponse<string>> {
        await Promise.resolve(httpRequest);
        return { body: "any_response", statusCode: 200 };
      }
    }
    const controllerStub = new ControllerStub();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const sut = new LogControllerDecorator(controllerStub);
    const input: HttpRequest<string> = {
      body: "any_body",
    };

    await sut.handle(input);

    expect(handleSpy).toHaveBeenCalledWith(input);
  });
});
