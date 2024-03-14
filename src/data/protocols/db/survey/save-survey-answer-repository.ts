import { SaveSurveyAnswerModel } from "@src/data/models/save-survey-answer-model";
import { SurveyResultModel } from "@src/data/models/survey-result-model";

export interface SaveSurveyAnswerRepository {
  save(data: SaveSurveyAnswerModel): Promise<SurveyResultModel>;
}
