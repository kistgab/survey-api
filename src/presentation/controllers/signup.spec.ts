import MissingParamError from "../errors/missing-param-error";
import SignUpController from "./signup";

function createSut(): SignUpController {
  return new SignUpController();
}

describe("SignUp Controller", () => {
  it("Should return 422 when name is not provided", () => {
    const sut = createSut();
    const httpRequest = {
      body: {
        name: "",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  it("Should return 422 when email is not provided", () => {
    const sut = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  it("Should return 422 when password is not provided", () => {
    const sut = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  it("Should return 422 when password confirmation is not provided", () => {
    const sut = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"));
  });
});
