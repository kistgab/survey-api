import { AddSurveyModel } from "@src/data/models/survey-model";

export default interface AddSurveyRepository {
  add(surveyData: AddSurveyModel): Promise<void>;
}
