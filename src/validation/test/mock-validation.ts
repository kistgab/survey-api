import Validation from "@src/presentation/protocols/validation";

export function mockValidation(): Validation {
  class ValidationStub implements Validation {
    validate(): Error | undefined {
      return;
    }
  }
  return new ValidationStub();
}
