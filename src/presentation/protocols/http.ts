export interface HttpResponse<Body> {
  statusCode: number;
  body: Body;
}

export interface HttpRequest<Body> {
  body?: Body;
  headers?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}
