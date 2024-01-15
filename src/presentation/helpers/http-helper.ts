import ServerError from "../errors/server-error";
import { HttpResponse } from "../protocols/http";

export function unprocessableContent<T>(error: T): HttpResponse<T> {
  return {
    statusCode: 422,
    body: error,
  };
}

export function internalServerError(error: ServerError): HttpResponse<ServerError> {
  return {
    statusCode: 500,
    body: error,
  };
}
