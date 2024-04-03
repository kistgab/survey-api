import Encrypter from "@src/data/protocols/cryptography/encrypter";
import HashComparer from "@src/data/protocols/cryptography/hash-comparer";
import FindAccountByEmailRepository from "@src/data/protocols/db/account/find-account-by-email-repository";
import UpdateAccessTokenRepository from "@src/data/protocols/db/account/update-access-token-repository";
import { mockEncrypter, mockHashComparer } from "@src/data/test/mock-cryptography";
import {
  mockFindAccountByEmailRepository,
  mockUpdateAccessTokenRepository,
} from "@src/data/test/mock-db-account";
import DbAuthentication from "@src/data/usecases/account/authentication/db-authentication";
import { mockInputAuthenticationDto } from "@src/domain/test/mock-account";

type SutTypes = {
  sut: DbAuthentication;
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

function createSut(): SutTypes {
  const findAccountByEmailRepositoryStub = mockFindAccountByEmailRepository();
  const hashComparerStub = mockHashComparer();
  const encrypterStub = mockEncrypter();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
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

    await sut.auth(mockInputAuthenticationDto());

    expect(findSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("should throw if FindAccountByEmailRepository throws", async () => {
    const { sut, findAccountByEmailRepositoryStub } = createSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "findByEmail")
      .mockReturnValueOnce(Promise.reject(new Error("FindAccountByEmailRepository error")));

    await expect(sut.auth(mockInputAuthenticationDto())).rejects.toThrow(
      new Error("FindAccountByEmailRepository error"),
    );
  });

  it("should return null if FindAccountByEmailRepository returns null", async () => {
    const { sut, findAccountByEmailRepositoryStub } = createSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "findByEmail")
      .mockReturnValueOnce(Promise.resolve(null));

    const result = await sut.auth(mockInputAuthenticationDto());

    expect(result).toBeNull();
  });

  it("should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = createSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");

    await sut.auth(mockInputAuthenticationDto());

    expect(compareSpy).toHaveBeenCalledWith("any_password", "any_password");
  });

  it("should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = createSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(Promise.reject(new Error("HashComparer error")));

    await expect(sut.auth(mockInputAuthenticationDto())).rejects.toThrow(
      new Error("HashComparer error"),
    );
  });

  it("should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = createSut();
    jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(Promise.resolve(false));

    const result = await sut.auth(mockInputAuthenticationDto());

    expect(result).toBeNull();
  });

  it("should call Encrypter with correct id", async () => {
    const { sut, encrypterStub } = createSut();
    const compareSpy = jest.spyOn(encrypterStub, "encrypt");

    await sut.auth(mockInputAuthenticationDto());

    expect(compareSpy).toHaveBeenCalledWith("any_id");
  });

  it("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = createSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(Promise.reject(new Error("Encrypter error")));

    await expect(sut.auth(mockInputAuthenticationDto())).rejects.toThrow(
      new Error("Encrypter error"),
    );
  });

  it("should return null if HashComparer returns false", async () => {
    const { sut } = createSut();

    const result = await sut.auth(mockInputAuthenticationDto());

    expect(result).toEqual({ accessToken: "any_token", name: "any_name" });
  });

  it("should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = createSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "updateAccessToken");

    await sut.auth(mockInputAuthenticationDto());

    expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token");
  });

  it("should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = createSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockReturnValueOnce(Promise.reject(new Error("UpdateAccessTokenRepository error")));

    await expect(sut.auth(mockInputAuthenticationDto())).rejects.toThrow(
      new Error("UpdateAccessTokenRepository error"),
    );
  });
});
