import { InputAddSurveyDto } from "../../../domain/dtos/add-survey-dto";
import AddSurvey from "../../../domain/usecases/add-survey";
import AddSurveyRepository from "../../protocols/db/survey/add-survey-repository";

export default class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(data: InputAddSurveyDto): Promise<void> {
    await this.addSurveyRepository.add(data);
  }
}
