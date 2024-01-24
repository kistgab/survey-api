import MissingParamError from "../../../errors/missing-param-error";
import Validation from "../../../protocols/validation";
import ValidationComposite from "./validation-composite";

type SutTypes = {
  sut: ValidationComposite<unknown>;
  validationStubs: Validation<unknown>[];
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
  const validationStubs = [createValidationStub(), createValidationStub()];
  const sut = new ValidationComposite(validationStubs);
  return { sut, validationStubs };
}

describe("Validation Composite", () => {
  it("should return the same error that the internal validation returns", () => {
    const { sut, validationStubs } = createSut();
    jest.spyOn(validationStubs[1], "validate").mockReturnValueOnce(new MissingParamError("field"));

    const error = sut.validate({ field: "any_value" });

    expect(error).toEqual(new MissingParamError("field"));
  });

  it("should return the first error if more than one internal validation fails", () => {
    const { sut, validationStubs } = createSut();
    jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new Error("firstError"));
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("secondError"));

    const error = sut.validate({ field: "any_value" });

    expect(error).toEqual(new Error("firstError"));
  });

  it("should not return if validations succeed", () => {
    const { sut } = createSut();

    const result = sut.validate({ field: "any_value" });

    expect(result).toBeUndefined();
  });
});
