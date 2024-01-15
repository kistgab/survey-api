import { HttpResponse } from "../protocols/http";

export function unprocessableContent<T>(error: T): HttpResponse<T> {
  return {
    statusCode: 422,
    body: error,
  };
}

export function internalServerError<T>(error: T): HttpResponse<T> {
  return {
    statusCode: 500,
    body: error,
  };
}
