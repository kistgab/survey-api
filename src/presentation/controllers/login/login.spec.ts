import MissingParamError from "../../errors/missing-param-error";
import { unprocessableContent } from "../../helpers/http-helper";
import LoginController from "./login";

describe("Login Controller", () => {
  it("should return 422 if no email is provided", async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        password: "any_password",
        email: "",
      },
    };

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(unprocessableContent(new MissingParamError("email")));
  });

  it("should return 422 if no password is provided", async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        password: "",
        email: "any_email@mail.com",
      },
    };

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(unprocessableContent(new MissingParamError("password")));
  });
});
