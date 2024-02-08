import { AddSurveyModel } from "../../../../data/models/survey-model";
import AddSurveyRepository from "../../../../data/protocols/db/survey/add-survey-repository";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveysCollection = MongoHelper.getCollection("surveys");
    await surveysCollection.insertOne(surveyData);
  }
}
