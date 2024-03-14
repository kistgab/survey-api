import { SurveyResultModel } from "@src/data/models/survey-result-model";
import { SaveSurveyAnswerRepository } from "@src/data/protocols/db/survey/save-survey-answer-repository";
import { InputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";
import AnswerSurvey from "@src/domain/usecases/survey-answer/answer-survey";

export class DbAnswerSurvey implements AnswerSurvey {
  constructor(private readonly saveSurveyAnswerRepository: SaveSurveyAnswerRepository) {}

  async answer(data: InputAnswerSurveyDto): Promise<SurveyResultModel> {
    const savedAnswer = await this.saveSurveyAnswerRepository.save(data);
    return savedAnswer;
  }
}
