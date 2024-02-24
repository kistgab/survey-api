import EmailValidatorAdapter from "@src/infra/validators/email/email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

function createSut(): EmailValidatorAdapter {
  return new EmailValidatorAdapter();
}

describe("EmailValidator Adapter", () => {
  it("should return false if validator returns false", () => {
    const sut = createSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);

    const output = sut.isValid("invalid-email@mail.com");

    expect(output).toBeFalsy();
  });

  it("should return false if validator returns false", () => {
    const sut = createSut();

    const output = sut.isValid("valid-email@mail.com");

    expect(output).toBeTruthy();
  });

  it("should call validator with the specified email", () => {
    const sut = createSut();
    const isEmailSpy = jest.spyOn(validator, "isEmail");
    const input = "valid-email@mail.com";

    sut.isValid(input);

    expect(isEmailSpy).toHaveBeenCalledWith(input);
  });
});
