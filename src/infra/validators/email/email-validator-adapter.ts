import { isEmail } from "validator";
import EmailValidator from "../../../validation/protocols/email-validator";

export default class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return isEmail(email);
  }
}
