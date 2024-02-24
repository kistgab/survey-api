import InvalidParamError from "@src/presentation/errors/invalid-param-error";
import CompareFieldsValidation from "@src/validation/validators/compare-fields/compare-fields-validation";

type anyType = { any_field: string; another_field: string };

function createSut(): CompareFieldsValidation<anyType> {
  return new CompareFieldsValidation("any_field", "another_field");
}

describe("CompareField Validation", () => {
  it("should return an InvalidParamError if the validation fails", () => {
    const sut = createSut();

    const result = sut.validate({ another_field: "one_value", any_field: "another_value" });

    expect(result).toEqual(new InvalidParamError("another_field"));
  });

  it("should not return if validation pass", () => {
    const sut = createSut();

    const result = sut.validate({ any_field: "any_value", another_field: "any_value" });

    expect(result).toBeUndefined();
  });
});
