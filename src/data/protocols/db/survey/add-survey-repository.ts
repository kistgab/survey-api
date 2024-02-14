import { AddSurveyModel } from "../../../models/survey-model";

export default interface AddSurveyRepository {
  add(surveyData: AddSurveyModel): Promise<void>;
}
