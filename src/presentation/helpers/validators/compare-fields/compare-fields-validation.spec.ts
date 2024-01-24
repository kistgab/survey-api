import InvalidParamError from "../../../errors/invalid-param-error";
import CompareFieldValidation from "./compare-fields-validation";
type anyType = { any_field: string; another_field: string };

function createSut(): CompareFieldValidation<anyType> {
  return new CompareFieldValidation("any_field", "another_field");
}

describe("CompareField Validation", () => {
  it("should return an InvalidParamError if the validation fails", () => {
    const sut = createSut();

    const result = sut.validate({ another_field: "one_value", any_field: "another_value" });

    expect(result).toEqual(new InvalidParamError("another_field"));
  });
});
