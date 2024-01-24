import InvalidParamError from "../../errors/invalid-param-error";
import Validation from "./validation";

export default class CompareFieldsValidation<T> implements Validation<T> {
  constructor(
    private readonly fieldName: keyof T,
    private readonly fieldToCompareName: keyof T,
  ) {}

  validate(input: T): Error | undefined {
    const areEqual = input[this.fieldName] === input[this.fieldToCompareName];
    if (!areEqual) {
      return new InvalidParamError(this.fieldToCompareName.toString());
    }
  }
}
