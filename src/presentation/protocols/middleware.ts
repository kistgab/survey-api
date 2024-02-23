import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http";

export default interface Middleware {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
