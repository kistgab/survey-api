export interface HttpResponse<Body> {
  statusCode: number;
  body: Body;
}

export interface HttpRequest<Body> {
  body?: Body;
  headers?: unknown;
}
