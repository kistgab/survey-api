import DbAuthentication from "../../../data/usecases/authentication/db-authentication";
import BCryptAdapter from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import JwtAdapter from "../../../infra/cryptography/jwt-adapter/jwt-adapter";
import LogMongoRepository from "../../../infra/db/mongodb/log/log-mongo-repository";
import LoginController, {
  RequestLoginBody,
  ResponseLoginBody,
} from "../../../presentation/controllers/login/login-controller";
import Controller from "../../../presentation/protocols/controller";
import LogControllerDecorator from "../../decorators/log-controller/log-controller-decorator";
import { AccountMongoRepository } from "./../../../infra/db/mongodb/account/account-mongo-repository";
import LoginValidationFactory from "./login-validation-factory";

export default abstract class LoginControllerFactory {
  static create(): Controller<RequestLoginBody, ResponseLoginBody | Error> {
    const accountMongoRepository = new AccountMongoRepository();
    const bCryptComparer = new BCryptAdapter(12);
    const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET);
    const dbAuthentication = new DbAuthentication(
      accountMongoRepository,
      bCryptComparer,
      jwtAdapter,
      accountMongoRepository,
    );
    const validationComposite = LoginValidationFactory.create();
    const loginController = new LoginController(dbAuthentication, validationComposite);
    const logMongoRepository = new LogMongoRepository();
    return new LogControllerDecorator(loginController, logMongoRepository);
  }
}
