import { HttpRequest, HttpResponse } from "./http";

export default interface Middleware {
  handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<unknown>>;
}
