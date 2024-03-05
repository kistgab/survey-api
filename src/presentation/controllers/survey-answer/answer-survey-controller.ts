import { InputAnswerSurveyDto, OutputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";
import AnswerSurvey from "@src/domain/usecases/survey-answer/answer-survey";
import { ListSurveyById } from "@src/domain/usecases/survey/list-survey-by-id";
import InvalidParamError from "@src/presentation/errors/invalid-param-error";
import MissingParamError from "@src/presentation/errors/missing-param-error";
import {
  internalServerError,
  ok,
  unprocessableContent,
} from "@src/presentation/helpers/http/http-helper";
import Controller from "@src/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http";

export type AnswerSurveyParams = { surveyId: string };

export type RequestAnswerSurvey = {
  answer: string;
};

export type ResponseAnswerSurvey = {
  answer: string;
};

export class AnswerSurveyController
  implements Controller<InputAnswerSurveyDto, OutputAnswerSurveyDto>
{
  constructor(
    private readonly listSurveyById: ListSurveyById,
    private readonly answerSurvey: AnswerSurvey,
  ) {}

  async handle(
    httpRequest: HttpRequest<InputAnswerSurveyDto, AnswerSurveyParams>,
  ): Promise<HttpResponse<OutputAnswerSurveyDto | Error>> {
    try {
      const { params } = httpRequest;
      const { body } = httpRequest;
      if (!body) {
        return unprocessableContent(new MissingParamError("body"));
      }
      const survey = await this.listSurveyById.list(params?.surveyId || "");
      if (!survey) {
        return unprocessableContent(new Error("Survey not found"));
      }
      const surveyAnswers = survey.answers.map((answer) => answer.answer);
      if (!surveyAnswers.includes(body?.answer || "")) {
        return unprocessableContent(new InvalidParamError("answer"));
      }
      const response = await this.answerSurvey.answer({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        surveyId: params!.surveyId,
        answer: body.answer,
        date: new Date(),
        accountId: body.accountId,
      });
      return ok(response);
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
