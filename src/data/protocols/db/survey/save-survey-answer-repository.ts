import { SaveSurveyAnswerModel } from "@src/data/models/save-survey-answer-model";

export interface SaveSurveyAnswerRepository {
  save(data: SaveSurveyAnswerModel): Promise<void>;
}
