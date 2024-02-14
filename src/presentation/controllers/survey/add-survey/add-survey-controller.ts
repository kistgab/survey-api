import AddSurvey from "../../../../domain/usecases/add-survey";
import MissingParamError from "../../../errors/missing-param-error";
import {
  internalServerError,
  noContent,
  unprocessableContent,
} from "../../../helpers/http/http-helper";
import Controller from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import Validation from "../../../protocols/validation";

export interface RequestAddSurveyBody {
  question: string;
  answers: {
    image: string;
    answer: string;
  }[];
}

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
