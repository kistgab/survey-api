import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http";

export default interface Controller<RequestBody, ResponseBody> {
  handle(httpRequest: HttpRequest<RequestBody>): Promise<HttpResponse<ResponseBody | Error>>;
}
