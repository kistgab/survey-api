import { HttpRequest, HttpResponse } from "./http";

export default interface Middleware {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
