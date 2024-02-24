import LogMongoRepository from "@src/infra/db/mongodb/log/log-mongo-repository";
import LogControllerDecorator from "@src/main/decorators/log-controller/log-controller-decorator";
import Controller from "@src/presentation/protocols/controller";

export default abstract class LogControllerDecoratorFactory {
  static create<T, R>(controller: Controller<T, R>): Controller<T, R> {
    const logErrorRepository = new LogMongoRepository();
    return new LogControllerDecorator(controller, logErrorRepository);
  }
}
