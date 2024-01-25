import { InputAuthenticationDto } from "../../../domain/dtos/authentication-dto";
import AccountModel from "../../models/account-model";
import { HashComparer } from "../../protocols/cryptography/hash-comparer";
import TokenGenerator from "../../protocols/cryptography/token-generator";
import FindAccountByEmailRepository from "../../protocols/db/find-account-by-email-repository";
import DbAuthentication from "./db-authentication";

function createFakeAccount(): AccountModel {
  return {
    id: "any_id",
    name: "any_name",
    email: "any_email@mail.com",
    password: "hashed_password",
  };
}

function createFindAccountByEmailRepository(): FindAccountByEmailRepository {
  class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
    async find(): Promise<AccountModel | null> {
      return Promise.resolve(createFakeAccount());
    }
  }
  return new FindAccountByEmailRepositoryStub();
}

function createHashComparerStub(): HashComparer {
  class HashComparerStub implements HashComparer {
    async compare(): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new HashComparerStub();
}

function createTokenGeneratorStub(): TokenGenerator {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(): Promise<string> {
      return Promise.resolve("any_token");
    }
  }
  return new TokenGeneratorStub();
}

function createFakeInputDto(): InputAuthenticationDto {
  return {
    email: "any_email@mail.com",
    password: "any_password",
  };
}

type SutTypes = {
  sut: DbAuthentication;
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
};

function createSut(): SutTypes {
  const findAccountByEmailRepositoryStub = createFindAccountByEmailRepository();
  const hashComparerStub = createHashComparerStub();
  const tokenGeneratorStub = createTokenGeneratorStub();
  const sut = new DbAuthentication(
    findAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
  );
  return {
    sut,
    findAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
  };
}

describe("DbAuthentication UseCase", () => {
  it("should call FindAccountByEmailRepository with correct email", async () => {
    const { sut, findAccountByEmailRepositoryStub } = createSut();
    const findSpy = jest.spyOn(findAccountByEmailRepositoryStub, "find");

    await sut.auth(createFakeInputDto());

    expect(findSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("should throw if FindAccountByEmailRepository throws", async () => {
    const { sut, findAccountByEmailRepositoryStub } = createSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "find")
      .mockReturnValueOnce(Promise.reject(new Error("FindAccountByEmailRepository error")));

    await expect(sut.auth(createFakeInputDto())).rejects.toThrow(
      new Error("FindAccountByEmailRepository error"),
    );
  });

  it("should return null if FindAccountByEmailRepository returns null", async () => {
    const { sut, findAccountByEmailRepositoryStub } = createSut();
    jest.spyOn(findAccountByEmailRepositoryStub, "find").mockReturnValueOnce(Promise.resolve(null));

    const result = await sut.auth(createFakeInputDto());

    expect(result).toBeNull();
  });

  it("should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = createSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");

    await sut.auth(createFakeInputDto());

    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  it("should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = createSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(Promise.reject(new Error("HashComparer error")));

    await expect(sut.auth(createFakeInputDto())).rejects.toThrow(new Error("HashComparer error"));
  });

  it("should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = createSut();
    jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(Promise.resolve(false));

    const result = await sut.auth(createFakeInputDto());

    expect(result).toBeNull();
  });

  it("should call TokenGenerator with correct id", async () => {
    const { sut, tokenGeneratorStub } = createSut();
    const compareSpy = jest.spyOn(tokenGeneratorStub, "generate");

    await sut.auth(createFakeInputDto());

    expect(compareSpy).toHaveBeenCalledWith("any_id");
  });

  it("should throw if TokenGenerator throws", async () => {
    const { sut, tokenGeneratorStub } = createSut();
    jest
      .spyOn(tokenGeneratorStub, "generate")
      .mockReturnValueOnce(Promise.reject(new Error("TokenGenerator error")));

    await expect(sut.auth(createFakeInputDto())).rejects.toThrow(new Error("TokenGenerator error"));
  });
});
