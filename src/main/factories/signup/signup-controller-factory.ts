import DbAddAccount from "../../../data/usecases/add-account/db-add-account";
import { OutputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import BCryptAdapter from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import LogMongoRepository from "../../../infra/db/mongodb/log/log-mongo-repository";
import SignUpController, {
  RequestSignUpBody,
} from "../../../presentation/controllers/signup/signup-controller";
import Controller from "../../../presentation/protocols/controller";
import LogControllerDecorator from "../../decorators/log-controller/log-controller-decorator";
import SignUpValidationFactory from "./signup-validation-factory";

export default abstract class SignUpControllerFactory {
  static create(): Controller<RequestSignUpBody, Error | OutputAddAccountDto> {
    const salt = 12;
    const hasher = new BCryptAdapter(salt);
    const accountRepository = new AccountMongoRepository();
    const addAccount = new DbAddAccount(hasher, accountRepository);
    const validation = SignUpValidationFactory.create();
    const signUpController = new SignUpController(addAccount, validation);
    const logErrorRepository = new LogMongoRepository();
    return new LogControllerDecorator(signUpController, logErrorRepository);
  }
}
