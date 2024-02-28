import { InputAddSurveyDto } from "@src/domain/dtos/add-survey-dto";

export default interface AddSurvey {
  add(survey: InputAddSurveyDto): Promise<void>;
}
