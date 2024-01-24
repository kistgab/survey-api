import MissingParamError from "../../../errors/missing-param-error";
import Validation from "../validation";
import ValidationComposite from "./validation-composite";

describe("Validation Composite", () => {
  it("should return the same error that the internal validation returns", () => {
    class ValidationStub implements Validation<unknown> {
      validate(): Error | undefined {
        return new MissingParamError("field");
      }
    }
    const validations = [new ValidationStub()];
    const sut = new ValidationComposite(validations);

    const error = sut.validate({ field: "any_value" });

    expect(error).toEqual(new MissingParamError("field"));
  });
});
