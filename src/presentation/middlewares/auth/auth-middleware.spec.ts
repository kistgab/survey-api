import AccountModel from "../../../data/models/account-model";
import FindAccountByTokenRepository from "../../../data/protocols/db/account/find-account-by-token-repository";
import AccessDeniedError from "../../errors/access-denied-error";
import { forbidden } from "../../helpers/http/http-helper";
import { AuthMiddleware } from "./auth-middleware";

function createFakeAccount(): AccountModel {
  return {
    id: "any_id",
    email: "any_email@mail.com",
    password: "hashed_password",
    name: "any_name",
  };
}

function createFindAccountByTokenRepositoryStub(): FindAccountByTokenRepository {
  class FindAccountByTokenRepositoryStub implements FindAccountByTokenRepository {
    async findByToken(): Promise<AccountModel | null> {
      return Promise.resolve(createFakeAccount());
    }
  }
  return new FindAccountByTokenRepositoryStub();
}

type SutTypes = {
  sut: AuthMiddleware;
  findAccountByTokenRepositoryStub: FindAccountByTokenRepository;
};

function createSut(): SutTypes {
  const findAccountByTokenRepositoryStub = createFindAccountByTokenRepositoryStub();
  const sut = new AuthMiddleware(findAccountByTokenRepositoryStub);
  return {
    sut,
    findAccountByTokenRepositoryStub,
  };
}

describe("Auth Middleware", () => {
  it("should return 403 if no x-access-token is provided in headers", async () => {
    const { sut } = createSut();

    const result = await sut.handle({});

    expect(result).toEqual(forbidden(new AccessDeniedError()));
  });

  it("should call FindAccountByTokenRepository with correct accessToken", async () => {
    const { sut, findAccountByTokenRepositoryStub } = createSut();
    const findAccountByTokenSpy = jest.spyOn(findAccountByTokenRepositoryStub, "findByToken");

    await sut.handle({ headers: { "x-access-token": "any_token" } });

    expect(findAccountByTokenSpy).toHaveBeenCalledWith("any_token");
  });

  it("should return 403 if FindAccountByTokenRepository returns null", async () => {
    const { sut, findAccountByTokenRepositoryStub } = createSut();
    jest
      .spyOn(findAccountByTokenRepositoryStub, "findByToken")
      .mockReturnValueOnce(Promise.resolve(null));

    const result = await sut.handle({});

    expect(result).toEqual(forbidden(new AccessDeniedError()));
  });
});
