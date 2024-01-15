import validator from "validator";
import EmailValidatorAdapter from "./email-validator-adapter";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe("EmailValidator Adapter", () => {
  it("should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);

    const output = sut.isValid("invalid-email@mail.com");

    expect(output).toBeFalsy();
  });

  it("should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();

    const output = sut.isValid("valid-email@mail.com");

    expect(output).toBeTruthy();
  });
});
