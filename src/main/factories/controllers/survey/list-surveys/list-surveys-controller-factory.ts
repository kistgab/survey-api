import { SurveyModel } from "@src/data/models/survey-model";
import LogControllerDecoratorFactory from "@src/main/factories/decorators/log-controller-decorator-factory";
import DbListSurveysFactory from "@src/main/factories/usecases/list-surveys/db-list-surveys-factory";
import ListSurveysController from "@src/presentation/controllers/survey/list-surveys/list-surveys-controller";
import Controller from "@src/presentation/protocols/controller";

export default abstract class ListSurveysControllerFactory {
  static create(): Controller<unknown, SurveyModel[] | null> {
    const controller = new ListSurveysController(DbListSurveysFactory.create());
    return LogControllerDecoratorFactory.create(controller);
  }
}
