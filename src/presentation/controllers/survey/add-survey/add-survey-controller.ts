import AddSurvey from "@src/domain/usecases/survey/add-survey";
import MissingParamError from "@src/presentation/errors/missing-param-error";
import {
  internalServerError,
  noContent,
  unprocessableContent,
} from "@src/presentation/helpers/http/http-helper";
import Controller from "@src/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http";
import Validation from "@src/presentation/protocols/validation";

export type RequestAddSurveyBody = {
  question: string;
  answers: {
    image: string;
    answer: string;
  }[];
};

export class AddSurveyController implements Controller<RequestAddSurveyBody, Error | null> {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey,
  ) {}

  async handle(
    httpRequest: HttpRequest<RequestAddSurveyBody>,
  ): Promise<HttpResponse<Error | null>> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return unprocessableContent(error);
      }
      if (!httpRequest.body) {
        return unprocessableContent(new MissingParamError("body"));
      }
      const { answers, question } = httpRequest.body;
      await this.addSurvey.add({ question, answers });
      return noContent();
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
