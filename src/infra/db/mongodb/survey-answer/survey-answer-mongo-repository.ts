import { SaveSurveyAnswerModel } from "@src/data/models/save-survey-answer-model";
import { SurveyResultModel } from "@src/data/models/survey-result-model";
import { SaveSurveyAnswerRepository } from "@src/data/protocols/db/survey/save-survey-answer-repository";
import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";
import { ObjectId } from "mongodb";

export class SurveyAnswerMongoRepository implements SaveSurveyAnswerRepository {
  async save(data: SaveSurveyAnswerModel): Promise<SurveyResultModel> {
    const surveyAnswerCollection = MongoHelper.getCollection("surveyAnswers");
    await surveyAnswerCollection.findOneAndUpdate(
      { surveyId: new ObjectId(data.surveyId), accountId: new ObjectId(data.accountId) },
      {
        $set: {
          answer: data.answer,
          date: data.date,
        },
      },
      { upsert: true },
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const surveyResult = (await this.loadBySurveyId(data.surveyId))!;
    return {
      answers: surveyResult.answers,
      date: surveyResult.date,
      question: surveyResult.question,
      surveyId: surveyResult.surveyId.toString(),
    };
  }

  private async loadBySurveyId(surveyId: string): Promise<SurveyResultModel | null> {
    const surveyAnswerCollection = MongoHelper.getCollection("surveyAnswers");
    const query = surveyAnswerCollection.aggregate([
      {
        $match: {
          surveyId: new ObjectId(surveyId),
        },
      },
      {
        $group: {
          _id: 0,
          data: {
            $push: "$$ROOT",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $unwind: {
          path: "$data",
        },
      },
      {
        $lookup: {
          from: "surveys",
          localField: "data.surveyId",
          foreignField: "_id",
          as: "survey",
        },
      },
      {
        $unwind: {
          path: "$survey",
        },
      },
      {
        $group: {
          _id: {
            surveyId: "$survey._id",
            question: "$survey.question",
            total: "$count",
            date: "$survey.date",
            answer: {
              $filter: {
                input: "$survey.answers",
                as: "item",
                cond: {
                  $eq: ["$$item.answer", "$data.answer"],
                },
              },
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $unwind: {
          path: "$_id.answer",
        },
      },
      {
        $addFields: {
          "_id.answer.count": "$count",
          "_id.answer.percent": {
            $multiply: [
              {
                $divide: ["$count", "$_id.total"],
              },
              100,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            surveyId: "$_id.surveyId",
            question: "$_id.question",
            date: "$_id.date",
          },
          answers: {
            $push: "$_id.answer",
          },
        },
      },
      {
        $project: {
          _id: 0,
          surveyId: "$_id.surveyId",
          question: "$_id.question",
          date: "$_id.date",
          answers: "$answers",
        },
      },
    ]);
    const surveyResult = await query.toArray();
    return (surveyResult?.[0] as SurveyResultModel) || null;
  }
}
