import { AddSurveyModel, SurveyModel } from "@src/data/models/survey-model";
import AddSurveyRepository from "@src/data/protocols/db/survey/add-survey-repository";
import { FindAllSurveysRepository } from "@src/data/protocols/db/survey/find-all-surveys-repository";
import { FindSurveyByIdRepository } from "@src/data/protocols/db/survey/find-by-id-surveys-repository";
import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";
import { QueryBuilder } from "@src/infra/db/mongodb/helpers/query-builder";
import { ObjectId } from "mongodb";

export class SurveyMongoRepository
  implements AddSurveyRepository, FindAllSurveysRepository, FindSurveyByIdRepository
{
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveysCollection = MongoHelper.getCollection("surveys");
    await surveysCollection.insertOne(surveyData);
  }

  async findAll(accountId: string): Promise<SurveyModel[]> {
    const surveysCollection = MongoHelper.getCollection("surveys");
    const query = new QueryBuilder()
      .lookup({
        from: "surveyAnswers",
        foreignField: "surveyId",
        localField: "_id",
        as: "result",
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: "$result",
                  as: "item",
                  cond: {
                    $eq: ["$$item.accountId", new ObjectId(accountId)],
                  },
                },
              },
            },
            1,
          ],
        },
      })
      .build();
    const surveys = await surveysCollection.aggregate(query).toArray();
    return surveys.map((survey) => {
      const { _id, ...surveyWithoutId } = survey;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
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
