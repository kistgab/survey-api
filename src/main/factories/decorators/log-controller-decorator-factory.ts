import LogMongoRepository from "../../../infra/db/mongodb/log/log-mongo-repository";
import Controller from "../../../presentation/protocols/controller";
import LogControllerDecorator from "../../decorators/log-controller/log-controller-decorator";

export default abstract class LogControllerDecoratorFactory {
  static create<T, R>(controller: Controller<T, R>): Controller<T, R> {
    const logErrorRepository = new LogMongoRepository();
    return new LogControllerDecorator(controller, logErrorRepository);
  }
}
