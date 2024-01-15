import { isEmail } from "validator";
import EmailValidator from "../presentation/protocols/email-validator";

export default class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return isEmail(email);
  }
}
