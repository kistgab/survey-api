import AccountModel from "@src/data/models/account-model";
import Encrypter from "@src/data/protocols/cryptography/encrypter";
import HashComparer from "@src/data/protocols/cryptography/hash-comparer";
import FindAccountByEmailRepository from "@src/data/protocols/db/account/find-account-by-email-repository";
import UpdateAccessTokenRepository from "@src/data/protocols/db/account/update-access-token-repository";
import DbAuthentication from "@src/data/usecases/account/authentication/db-authentication";
import { InputAuthenticationDto } from "@src/domain/dtos/authentication-dto";

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
    async findByEmail(): Promise<AccountModel | null> {
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

function createEncrypterStub(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return Promise.resolve("any_token");
    }
  }
  return new EncrypterStub();
}

function createUpdateAccessTokenRepositoryStub(): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(): Promise<void> {
      return Promise.resolve();
    }
  }
  return new UpdateAccessTokenRepositoryStub();
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
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

function createSut(): SutTypes {
  const findAccountByEmailRepositoryStub = createFindAccountByEmailRepository();
  const hashComparerStub = createHashComparerStub();
  const encrypterStub = createEncrypterStub();
  const updateAccessTokenRepositoryStub = createUpdateAccessTokenRepositoryStub();
  const sut = new DbAuthentication(
    findAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  );
  return {
    sut,
    findAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  };
}

describe("DbAuthentication UseCase", () => {
  it("should call FindAccountByEmailRepository with correct email", async () => {
    const { sut, findAccountByEmailRepositoryStub } = createSut();
    const findSpy = jest.spyOn(findAccountByEmailRepositoryStub, "findByEmail");

    await sut.auth(createFakeInputDto());

    expect(findSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("should throw if FindAccountByEmailRepository throws", async () => {
    const { sut, findAccountByEmailRepositoryStub } = createSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "findByEmail")
      .mockReturnValueOnce(Promise.reject(new Error("FindAccountByEmailRepository error")));

    await expect(sut.auth(createFakeInputDto())).rejects.toThrow(
      new Error("FindAccountByEmailRepository error"),
    );
  });

  it("should return null if FindAccountByEmailRepository returns null", async () => {
    const { sut, findAccountByEmailRepositoryStub } = createSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "findByEmail")
      .mockReturnValueOnce(Promise.resolve(null));

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

  it("should call Encrypter with correct id", async () => {
    const { sut, encrypterStub } = createSut();
    const compareSpy = jest.spyOn(encrypterStub, "encrypt");

    await sut.auth(createFakeInputDto());

    expect(compareSpy).toHaveBeenCalledWith("any_id");
  });

  it("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = createSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(Promise.reject(new Error("Encrypter error")));

    await expect(sut.auth(createFakeInputDto())).rejects.toThrow(new Error("Encrypter error"));
  });

  it("should return null if HashComparer returns false", async () => {
    const { sut } = createSut();

    const accessToken = await sut.auth(createFakeInputDto());

    expect(accessToken).toBe("any_token");
  });

  it("should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = createSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "updateAccessToken");

    await sut.auth(createFakeInputDto());

    expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token");
  });

  it("should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = createSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockReturnValueOnce(Promise.reject(new Error("UpdateAccessTokenRepository error")));

    await expect(sut.auth(createFakeInputDto())).rejects.toThrow(
      new Error("UpdateAccessTokenRepository error"),
    );
  });
});
