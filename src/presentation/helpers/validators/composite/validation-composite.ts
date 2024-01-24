import Validation from "../validation";

export default class ValidationComposite<T> implements Validation<T> {
  constructor(private readonly validations: Validation<unknown>[]) {}

  validate<T>(input: T): Error | undefined {
    for (const validation of this.validations) {
      const error = validation.validate(input);
      if (error) {
        return error;
      }
    }
  }
}
