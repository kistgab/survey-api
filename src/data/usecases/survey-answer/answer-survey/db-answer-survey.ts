import { SurveyAnswerModel } from "@src/data/models/save-survey-answer-model";
import { SaveSurveyAnswerRepository } from "@src/data/protocols/db/survey/save-survey-answer-repository";
import { InputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";
import AnswerSurvey from "@src/domain/usecases/survey-answer/answer-survey";

export class DbAnswerSurvey implements AnswerSurvey {
  constructor(private readonly saveSurveyAnswerRepository: SaveSurveyAnswerRepository) {}

  async answer(data: InputAnswerSurveyDto): Promise<SurveyAnswerModel> {
    const savedAnswer = await this.saveSurveyAnswerRepository.save(data);
    return savedAnswer;
  }
}
