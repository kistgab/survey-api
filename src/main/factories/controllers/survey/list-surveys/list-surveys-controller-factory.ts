import { SurveyModel } from "../../../../../data/models/survey-model";
import ListSurveysController from "../../../../../presentation/controllers/survey/list-surveys/list-surveys-controller";
import Controller from "../../../../../presentation/protocols/controller";
import LogControllerDecoratorFactory from "../../../decorators/log-controller-decorator-factory";
import DbListSurveysFactory from "../../../usecases/list-surveys/db-list-surveys-factory";

export default abstract class ListSurveysControllerFactory {
  static create(): Controller<unknown, SurveyModel[] | null> {
    const controller = new ListSurveysController(DbListSurveysFactory.create());
    return LogControllerDecoratorFactory.create(controller);
  }
}
