import InvalidParamError from "@src/presentation/errors/invalid-param-error";
import Validation from "@src/presentation/protocols/validation";
import EmailValidator from "@src/validation/protocols/email-validator";

export default class EmailValidation<T> implements Validation<T> {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly fieldName: keyof T,
  ) {}

  validate(input: T): Error | undefined {
    const email = String(input[this.fieldName]);
    if (!this.emailValidator.isValid(email)) {
      return new InvalidParamError(this.fieldName.toString());
    }
  }
}
