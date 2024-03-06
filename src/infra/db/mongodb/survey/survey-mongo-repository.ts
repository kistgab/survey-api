import { AddSurveyModel, SurveyModel } from "@src/data/models/survey-model";
import AddSurveyRepository from "@src/data/protocols/db/survey/add-survey-repository";
import { FindAllSurveysRepository } from "@src/data/protocols/db/survey/find-all-surveys-repository";
import { FindSurveyByIdRepository } from "@src/data/protocols/db/survey/find-by-id-surveys-repository";
import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";
import { ObjectId } from "mongodb";

export class SurveyMongoRepository
  implements AddSurveyRepository, FindAllSurveysRepository, FindSurveyByIdRepository
{
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveysCollection = MongoHelper.getCollection("surveys");
    await surveysCollection.insertOne(surveyData);
  }

  async findAll(): Promise<SurveyModel[]> {
    const surveysCollection = MongoHelper.getCollection("surveys");
    const surveys = await surveysCollection.find().toArray();
    return surveys.map((survey) => {
      const { _id, ...surveyWithoutId } = survey;
      return { ...surveyWithoutId, id: _id.toString() } as SurveyModel;
    });
  }

  async findById(id: string): Promise<SurveyModel | null> {
    const surveysCollection = MongoHelper.getCollection("surveys");
    const survey = await surveysCollection.findOne({ _id: new ObjectId(id) });
    if (!survey) return null;
    const { _id, ...surveyWithoutId } = survey;
    return { ...surveyWithoutId, id: _id.toString() } as SurveyModel;
  }
}
