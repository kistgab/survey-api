import {
  AddSurveyController,
  RequestAddSurveyBody,
} from "../../../../../presentation/controllers/survey/add-survey/add-survey-controller";
import Controller from "../../../../../presentation/protocols/controller";
import LogControllerDecoratorFactory from "../../../decorators/log-controller-decorator-factory";
import DbAddSurveyFactory from "../../../usecases/add-survey/db-add-survey-factory";
import AddSurveyValidationFactory from "./add-survey-validation-factory";

export default abstract class AddSurveyControllerFactory {
  static create(): Controller<RequestAddSurveyBody, Error | null> {
    const controller = new AddSurveyController(
      AddSurveyValidationFactory.create(),
      DbAddSurveyFactory.create(),
    );
    return LogControllerDecoratorFactory.create(controller);
  }
}
