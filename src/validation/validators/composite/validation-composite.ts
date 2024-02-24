import Validation from "@src/presentation/protocols/validation";

export default class ValidationComposite<T = unknown> implements Validation<T> {
  constructor(private readonly validations: Validation[]) {}

  validate<T>(input: T): Error | undefined {
    for (const validation of this.validations) {
      const error = validation.validate(input);
      if (error) {
        return error;
      }
    }
  }
}
