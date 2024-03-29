import { SaveSurveyAnswerModel } from "@src/data/models/save-survey-answer-model";
import { SurveyResultModel } from "@src/data/models/survey-result-model";
import { LoadSurveyResultRepository } from "@src/data/protocols/db/survey-answer/load-survey-result-repository";
import { SaveSurveyAnswerRepository } from "@src/data/protocols/db/survey/save-survey-answer-repository";
import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";
import { ObjectId } from "mongodb";
import { QueryBuilder } from "./../helpers/query-builder";

export class SurveyAnswerMongoRepository
  implements SaveSurveyAnswerRepository, LoadSurveyResultRepository
{
  async save(data: SaveSurveyAnswerModel): Promise<void> {
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
  }

  async loadBySurveyId(surveyId: string): Promise<SurveyResultModel | null> {
    const surveyAnswerCollection = MongoHelper.getCollection("surveyAnswers");
    const query = new QueryBuilder()
      .match({ surveyId: new ObjectId(surveyId) })
      .group({
        _id: 0,
        data: {
          $push: "$$ROOT",
        },
        total: {
          $sum: 1,
        },
      })
      .unwind({
        path: "$data",
      })
      .lookup({
        from: "surveys",
        localField: "data.surveyId",
        foreignField: "_id",
        as: "survey",
      })
      .unwind({
        path: "$survey",
      })
      .group({
        _id: {
          surveyId: "$survey._id",
          question: "$survey.question",
          total: "$total",
          date: "$survey.date",
          answer: "$data.answer",
          answers: "$survey.answers",
        },
        count: {
          $sum: 1,
        },
      })
      .project({
        _id: 0,
        surveyId: "$_id.surveyId",
        question: "$_id.question",
        date: "$_id.date",
        answers: {
          $map: {
            input: "$_id.answers",
            as: "item",
            in: {
              $mergeObjects: [
                "$$item",
                {
                  count: {
                    $cond: {
                      if: {
                        $eq: ["$$item.answer", "$_id.answer"],
                      },
                      then: "$count",
                      else: 0,
                    },
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: ["$$item.answer", "$_id.answer"],
                      },
                      then: {
                        $multiply: [
                          {
                            $divide: ["$count", "$_id.total"],
                          },
                          100,
                        ],
                      },
                      else: 0,
                    },
                  },
                },
              ],
            },
          },
        },
      })
      .group({
        _id: {
          surveyId: "$surveyId",
          date: "$date",
          question: "$question",
        },
        answers: {
          $push: "$answers",
        },
      })
      .project({
        _id: 0,
        surveyId: "$_id.surveyId",
        question: "$_id.question",
        date: "$_id.date",
        answers: {
          $reduce: {
            input: "$answers",
            initialValue: [],
            in: {
              $concatArrays: ["$$value", "$$this"],
            },
          },
        },
      })
      .unwind({
        path: "$answers",
      })
      .sort({
        "answers.count": -1,
      })
      .group({
        _id: {
          surveyId: "$surveyId",
          question: "$question",
          date: "$date",
          answer: "$answers.answer",
          image: "$answers.image",
        },
        count: {
          $sum: "$answers.count",
        },
        percent: {
          $sum: "$answers.percent",
        },
      })
      .project({
        _id: 0,
        surveyId: "$_id.surveyId",
        question: "$_id.question",
        date: "$_id.date",
        answer: {
          answer: "$_id.answer",
          image: "$_id.image",
          count: "$count",
          percent: "$percent",
        },
      })
      .group({
        _id: {
          surveyId: "$surveyId",
          question: "$question",
          date: "$date",
        },
        answers: {
          $push: "$answer",
        },
      })
      .project({
        _id: 0,
        surveyId: "$_id.surveyId",
        question: "$_id.question",
        date: "$_id.date",
        answers: "$answers",
      })
      .build();
    const surveyResult = await surveyAnswerCollection.aggregate(query).toArray();
    if (!surveyResult.length) {
      return null;
    }
    const { surveyId: resultId, ...surveyResultWithoutObjectId } = surveyResult[0];
    const surveyResultModel = {
      surveyId: (resultId as ObjectId).toString(),
      ...surveyResultWithoutObjectId,
    } as SurveyResultModel;
    return surveyResultModel;
  }
}
