import AddSurveyRepository from "@src/data/protocols/db/survey/add-survey-repository";
import { InputAddSurveyDto } from "@src/domain/dtos/add-survey-dto";
import AddSurvey from "@src/domain/usecases/survey/add-survey";

export default class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(data: InputAddSurveyDto): Promise<void> {
    const date = new Date();
    await this.addSurveyRepository.add({ ...data, date });
  }
}
