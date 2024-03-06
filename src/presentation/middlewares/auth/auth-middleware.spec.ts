import { AccountModel } from "@src/data/models/account-model";
import FindAccountByToken from "@src/domain/usecases/account/find-account-by-token";
import AccessDeniedError from "@src/presentation/errors/access-denied-error";
import { forbidden, internalServerError, ok } from "@src/presentation/helpers/http/http-helper";
import { AuthMiddleware } from "@src/presentation/middlewares/auth/auth-middleware";
import { HttpRequest } from "@src/presentation/protocols/http";

function createFakeRequest(): HttpRequest<unknown> {
  return { headers: { "x-access-token": "any_token" } };
}

function createFakeAccount(): AccountModel {
  return {
    id: "any_id",
    email: "any_email@mail.com",
    password: "hashed_password",
    name: "any_name",
  };
}

function createFindAccountByTokenStub(): FindAccountByToken {
  class FindAccountByTokenStub implements FindAccountByToken {
    async findByToken(): Promise<AccountModel | null> {
      return Promise.resolve(createFakeAccount());
    }
  }
  return new FindAccountByTokenStub();
}

type SutTypes = {
  sut: AuthMiddleware;
  findAccountByTokenStub: FindAccountByToken;
};

function createSut(role?: string): SutTypes {
  const findAccountByTokenStub = createFindAccountByTokenStub();
  const sut = new AuthMiddleware(findAccountByTokenStub, role);
  return {
    sut,
    findAccountByTokenStub,
  };
}

describe("Auth Middleware", () => {
  it("should return 403 if no x-access-token is provided in headers", async () => {
    const { sut } = createSut();

    const result = await sut.handle({});

    expect(result).toEqual(forbidden(new AccessDeniedError()));
  });

  it("should call FindAccountByToken with correct accessToken", async () => {
    const role = "any_role";
    const { sut, findAccountByTokenStub } = createSut(role);
    const findAccountByTokenSpy = jest.spyOn(findAccountByTokenStub, "findByToken");

    await sut.handle(createFakeRequest());

    expect(findAccountByTokenSpy).toHaveBeenCalledWith("any_token", role);
  });

  it("should return 403 if FindAccountByToken returns null", async () => {
    const { sut, findAccountByTokenStub } = createSut();
    jest.spyOn(findAccountByTokenStub, "findByToken").mockReturnValueOnce(Promise.resolve(null));

    const result = await sut.handle(createFakeRequest());

    expect(result).toEqual(forbidden(new AccessDeniedError()));
  });

  it("should return 200 if FindAccountByToken returns an account", async () => {
    const { sut } = createSut();

    const result = await sut.handle(createFakeRequest());

    expect(result).toEqual(ok({ accountId: "any_id" }));
  });

  it("should return 403 if FindAccountByToken throws", async () => {
    const { sut, findAccountByTokenStub } = createSut();
    jest
      .spyOn(findAccountByTokenStub, "findByToken")
      .mockReturnValueOnce(Promise.reject(new Error("Repository Error")));

    const result = await sut.handle(createFakeRequest());

    expect(result).toEqual(internalServerError(new Error("Repository Error")));
  });
});
