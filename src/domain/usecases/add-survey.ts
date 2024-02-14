import { InputAddSurveyDto } from "../dtos/add-survey-dto";

export default interface AddSurvey {
  add(survey: InputAddSurveyDto): Promise<void>;
}
