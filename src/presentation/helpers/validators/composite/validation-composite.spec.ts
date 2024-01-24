import MissingParamError from "../../../errors/missing-param-error";
import Validation from "../validation";
import ValidationComposite from "./validation-composite";

type SutTypes = {
  sut: ValidationComposite<unknown>;
  validationStub: Validation<unknown>;
};

function createValidationStub(): Validation<unknown> {
  class ValidationStub implements Validation<unknown> {
    validate(): Error | undefined {
      return;
    }
  }
  return new ValidationStub();
}

function createSut(): SutTypes {
  const validationStub = createValidationStub();
  const sut = new ValidationComposite([validationStub]);
  return { sut, validationStub };
}

describe("Validation Composite", () => {
  it("should return the same error that the internal validation returns", () => {
    const { sut, validationStub } = createSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("field"));

    const error = sut.validate({ field: "any_value" });

    expect(error).toEqual(new MissingParamError("field"));
  });
});
