import SignUpController, {
  RequestSignUpBody,
  ResponseSignUpBody,
} from "../../../../presentation/controllers/signup/signup-controller";
import Controller from "../../../../presentation/protocols/controller";
import LogControllerDecoratorFactory from "../../decorators/log-controller-decorator-factory";
import DbAddAccountFactory from "../../usecases/add-account/db-add-account-factory";
import DbAuthenticationFactory from "../../usecases/authentication/db-authentication-factory";
import SignUpValidationFactory from "./signup-validation-factory";

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
