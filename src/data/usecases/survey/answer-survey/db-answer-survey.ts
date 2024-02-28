import { SurveyAnswerModel } from "@src/data/models/save-survey-answer-model";
import { SaveSurveyAnswerRepository } from "@src/data/protocols/db/survey/save-survey-answer-repository";
import { InputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";
import AnswerSurvey from "@src/domain/usecases/answer-survey";

export class DbAnswerSurvey implements AnswerSurvey {
  constructor(private readonly saveSurveyAnswerRepository: SaveSurveyAnswerRepository) {}

  async answer(data: InputAnswerSurveyDto): Promise<SurveyAnswerModel> {
    await this.saveSurveyAnswerRepository.save(data);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return null!;
  }
}
