import DbAddAccount from "../../../data/usecases/add-account/db-add-account";
import DbAuthentication from "../../../data/usecases/authentication/db-authentication";
import BCryptAdapter from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import JwtAdapter from "../../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import LogMongoRepository from "../../../infra/db/mongodb/log/log-mongo-repository";
import SignUpController, {
  RequestSignUpBody,
  ResponseSignUpBody,
} from "../../../presentation/controllers/signup/signup-controller";
import Controller from "../../../presentation/protocols/controller";
import LogControllerDecorator from "../../decorators/log-controller/log-controller-decorator";
import SignUpValidationFactory from "./signup-validation-factory";

export default abstract class SignUpControllerFactory {
  static create(): Controller<RequestSignUpBody, Error | ResponseSignUpBody> {
    const salt = 12;
    const hasher = new BCryptAdapter(salt);
    const accountRepository = new AccountMongoRepository();
    const addAccount = new DbAddAccount(hasher, accountRepository);
    const validation = SignUpValidationFactory.create();
    const encrypter = new JwtAdapter(process.env.JWT_SECRET);
    const authentication = new DbAuthentication(
      accountRepository,
      hasher,
      encrypter,
      accountRepository,
    );
    const signUpController = new SignUpController(addAccount, validation, authentication);
    const logErrorRepository = new LogMongoRepository();
    return new LogControllerDecorator(signUpController, logErrorRepository);
  }
}
