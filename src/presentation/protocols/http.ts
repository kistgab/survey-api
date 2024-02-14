export interface HttpResponse<Body = unknown> {
  statusCode: number;
  body: Body;
}

export interface HttpRequest<Body = unknown> {
  body?: Body;
  headers?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}
