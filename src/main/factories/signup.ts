import DbAddAccount from "../../data/usecases/add-account/db-add-account";
import { OutputAddAccountDto } from "../../domain/dtos/add-account-dto";
import BCryptAdapter from "../../infra/cryptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import LogMongoRepository from "../../infra/db/mongodb/log-repository/log";
import SignUpController, { RequestSignUpBody } from "../../presentation/controllers/signup/signup";
import Controller from "../../presentation/protocols/controller";
import LogControllerDecorator from "../decorators/log/log";
import SignUpValidationFactory from "./signup-validation";

export default abstract class SignUpControllerFactory {
  static create(): Controller<RequestSignUpBody, Error | OutputAddAccountDto> {
    const salt = 12;
    const encrypter = new BCryptAdapter(salt);
    const accountRepository = new AccountMongoRepository();
    const addAccount = new DbAddAccount(encrypter, accountRepository);
    const validation = SignUpValidationFactory.create();
    const signUpController = new SignUpController(addAccount, validation);
    const logErrorRepository = new LogMongoRepository();
    return new LogControllerDecorator(signUpController, logErrorRepository);
  }
}
