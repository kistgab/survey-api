import LoginController, {
  RequestLoginBody,
  ResponseLoginBody,
} from "../../../../../presentation/controllers/authentication/login/login-controller";
import Controller from "../../../../../presentation/protocols/controller";
import LogControllerDecoratorFactory from "../../../decorators/log-controller-decorator-factory";
import DbAuthenticationFactory from "../../../usecases/authentication/db-authentication-factory";
import LoginValidationFactory from "./login-validation-factory";

export default abstract class LoginControllerFactory {
  static create(): Controller<RequestLoginBody, ResponseLoginBody | Error> {
    const controller = new LoginController(
      DbAuthenticationFactory.create(),
      LoginValidationFactory.create(),
    );
    return LogControllerDecoratorFactory.create(controller);
  }
}
