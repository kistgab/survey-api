import EmailValidatorAdapter from "./email-validator-adapter";

describe("EmailValidator Adapter", () => {
  it("should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    const output = sut.isValid("invalid-email@mail.com");
    expect(output).toBeFalsy();
  });
});
