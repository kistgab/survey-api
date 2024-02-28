export type HttpResponse<Body = unknown> = {
  statusCode: number;
  body: Body;
};

export type HttpRequest<Body = unknown, Params = unknown> = {
  body?: Body;
  headers?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  params?: Params;
};
