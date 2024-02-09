import AccessDeniedError from "../../errors/access-denied-error";
import { forbidden } from "../../helpers/http/http-helper";
import { AuthMiddleware } from "./auth-middleware";

describe("Auth Middleware", () => {
  it("should return 403 if no x-access-token is provided in headers", async () => {
    const sut = new AuthMiddleware();

    const result = await sut.handle({});

    expect(result).toEqual(forbidden(new AccessDeniedError()));
  });
});
