import SignUpValidationFactory from "@src/main/factories/controllers/authentication/signup/signup-validation-factory";
import LogControllerDecoratorFactory from "@src/main/factories/decorators/log-controller-decorator-factory";
import DbAddAccountFactory from "@src/main/factories/usecases/add-account/db-add-account-factory";
import DbAuthenticationFactory from "@src/main/factories/usecases/authentication/db-authentication-factory";
import SignUpController, {
  RequestSignUpBody,
  ResponseSignUpBody,
} from "@src/presentation/controllers/authentication/signup/signup-controller";
import Controller from "@src/presentation/protocols/controller";

export default abstract class SignUpControllerFactory {
  static create(): Controller<RequestSignUpBody, Error | ResponseSignUpBody> {
    const controller = new SignUpController(
      DbAddAccountFactory.create(),
      SignUpValidationFactory.create(),
      DbAuthenticationFactory.create(),
    );
    return LogControllerDecoratorFactory.create(controller);
  }
}
