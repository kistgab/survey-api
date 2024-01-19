import DbAddAccount from "../../data/usecases/add-account/db-add-account";
import { OutputAddAccountDto } from "../../domain/dtos/add-account-dto";
import BCryptAdapter from "../../infra/cryptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import SignUpController, { RequestSignUpBody } from "../../presentation/controllers/signup/signup";
import Controller from "../../presentation/protocols/controller";
import EmailValidatorAdapter from "../../utils/email-validator-adapter";
import LogControllerDecorator from "../decorators/log/log";

export default abstract class SignUpControllerFactory {
  static create(): Controller<RequestSignUpBody, Error | OutputAddAccountDto> {
    const salt = 12;
    const emailValidator = new EmailValidatorAdapter();
    const encrypter = new BCryptAdapter(salt);
    const accountRepository = new AccountMongoRepository();
    const addAccount = new DbAddAccount(encrypter, accountRepository);
    const signUpController = new SignUpController(emailValidator, addAccount);
    return new LogControllerDecorator(signUpController);
  }
}
