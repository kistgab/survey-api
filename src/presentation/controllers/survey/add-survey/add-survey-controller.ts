import { ok } from "../../../helpers/http/http-helper";
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
  constructor(private readonly validation: Validation) {}

  async handle(
    httpRequest: HttpRequest<RequestAddSurveyBody>,
  ): Promise<HttpResponse<Error | null>> {
    this.validation.validate(httpRequest.body);
    return Promise.resolve(ok(null));
  }
}
