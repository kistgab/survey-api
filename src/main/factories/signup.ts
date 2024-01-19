import DbAddAccount from "../../data/usecases/add-account/db-add-account";
import BCryptAdapter from "../../infra/cryptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import SignUpController from "../../presentation/controllers/signup/signup";
import EmailValidatorAdapter from "../../utils/email-validator-adapter";

export default abstract class SignUpControllerFactory {
  static create(): SignUpController {
    const salt = 12;
    const emailValidator = new EmailValidatorAdapter();
    const encrypter = new BCryptAdapter(salt);
    const accountRepository = new AccountMongoRepository();
    const addAccount = new DbAddAccount(encrypter, accountRepository);
    return new SignUpController(emailValidator, addAccount);
  }
}
