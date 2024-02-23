import MissingParamError from "@src/presentation/errors/missing-param-error";
import Validation from "@src/presentation/protocols/validation";

export default class RequiredFieldValidation<T> implements Validation<T> {
  constructor(private readonly fieldName: keyof T) {}

  validate(input: T): Error | undefined {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName.toString());
    }
  }
}
