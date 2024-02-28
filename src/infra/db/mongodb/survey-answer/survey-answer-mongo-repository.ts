import {
  SaveSurveyAnswerModel,
  SurveyAnswerModel,
} from "@src/data/models/save-survey-answer-model";
import { SaveSurveyAnswerRepository } from "@src/data/protocols/db/survey/save-survey-answer-repository";
import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";

export class SurveyAnswerMongoRepository implements SaveSurveyAnswerRepository {
  async save(data: SaveSurveyAnswerModel): Promise<SurveyAnswerModel> {
    const surveyAnswerCollection = MongoHelper.getCollection("surveyAnswers");
    const findAndUpdateResult = await surveyAnswerCollection.findOneAndUpdate(
      { surveyId: data.surveyId, accountId: data.accountId },
      {
        $set: {
          answer: data.answer,
          date: data.date,
        },
      },
      { upsert: true, returnDocument: "after" },
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { _id, ...result } = findAndUpdateResult!;
    return { id: _id.toString(), ...result } as SurveyAnswerModel;
  }
}
