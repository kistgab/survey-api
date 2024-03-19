import { SurveyResultModel } from "@src/data/models/survey-result-model";
import { LoadSurveyResultRepository } from "@src/data/protocols/db/survey-answer/load-survey-result-repository";
import { SaveSurveyAnswerRepository } from "@src/data/protocols/db/survey/save-survey-answer-repository";
import { InputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";
import AnswerSurvey from "@src/domain/usecases/survey-answer/answer-survey";

export class DbAnswerSurvey implements AnswerSurvey {
  constructor(
    private readonly saveSurveyAnswerRepository: SaveSurveyAnswerRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async answer(data: InputAnswerSurveyDto): Promise<SurveyResultModel> {
    await this.saveSurveyAnswerRepository.save(data);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const surveyResult = (await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId))!;
    return surveyResult;
  }
}
