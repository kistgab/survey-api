import LoginValidationFactory from "@src/main/factories/controllers/authentication/login/login-validation-factory";
import LogControllerDecoratorFactory from "@src/main/factories/decorators/log-controller-decorator-factory";
import DbAuthenticationFactory from "@src/main/factories/usecases/authentication/db-authentication-factory";
import LoginController, {
  RequestLoginBody,
  ResponseLoginBody,
} from "@src/presentation/controllers/authentication/login/login-controller";
import Controller from "@src/presentation/protocols/controller";

export default abstract class LoginControllerFactory {
  static create(): Controller<RequestLoginBody, ResponseLoginBody | Error> {
    const controller = new LoginController(
      DbAuthenticationFactory.create(),
      LoginValidationFactory.create(),
    );
    return LogControllerDecoratorFactory.create(controller);
  }
}
