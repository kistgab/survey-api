import RequiredFieldValidation from "./required-field-validation";

describe("RequiredField Validation", () => {
  it("should return a MissingParamError if the validation fails", () => {
    type anyType = { any_field: string };
    const sut = new RequiredFieldValidation("any_field");

    const result = sut.validate({} as anyType);

    expect(result).toEqual(new Error("Missing param: any_field"));
  });

  it("should not return if validation pass", () => {
    const sut = new RequiredFieldValidation("any_field");

    const result = sut.validate({ any_field: "any_value" });

    expect(result).toBeUndefined();
  });
});
