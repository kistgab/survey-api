import { InputAnswerSurveyDto, OutputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";

export default interface AnswerSurvey {
  answer(survey: InputAnswerSurveyDto): Promise<OutputAnswerSurveyDto>;
}
