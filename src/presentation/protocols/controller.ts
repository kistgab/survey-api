import { HttpRequest, HttpResponse } from "./http";

export default interface Controller<RequestBody, ResponseBody> {
  handle(httpRequest: HttpRequest<RequestBody>): Promise<HttpResponse<ResponseBody | Error>>;
}
