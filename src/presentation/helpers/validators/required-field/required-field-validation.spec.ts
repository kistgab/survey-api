import RequiredFieldValidation from "./required-field-validation";
type anyType = { any_field: string };

function createSut(): RequiredFieldValidation<anyType> {
  return new RequiredFieldValidation("any_field");
}

describe("RequiredField Validation", () => {
  it("should return a MissingParamError if the validation fails", () => {
    const sut = createSut();

    const result = sut.validate({} as anyType);

    expect(result).toEqual(new Error("Missing param: any_field"));
  });

  it("should not return if validation pass", () => {
    const sut = createSut();

    const result = sut.validate({ any_field: "any_value" });

    expect(result).toBeUndefined();
  });
});
