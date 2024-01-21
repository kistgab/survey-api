import ServerError from "../errors/server-error";
import { HttpResponse } from "../protocols/http";

export function unprocessableContent<T>(error: T): HttpResponse<T> {
  return {
    statusCode: 422,
    body: error,
  };
}

export function internalServerError(error: Error): HttpResponse<ServerError> {
  return {
    statusCode: 500,
    body: new ServerError(error.stack),
  };
}

export function ok<T>(body: T): HttpResponse<T> {
  return {
    statusCode: 200,
    body,
  };
}
