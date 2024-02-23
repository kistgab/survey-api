import EmailValidator from "@src/validation/protocols/email-validator";
import { isEmail } from "validator";

export default class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return isEmail(email);
  }
}
