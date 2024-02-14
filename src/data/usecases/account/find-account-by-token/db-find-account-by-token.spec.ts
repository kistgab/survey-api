import AccountModel from "../../../models/account-model";
import Decrypter from "../../../protocols/cryptography/decrypter";
import FindAccountByTokenRepository from "./../../../../data/protocols/db/account/find-account-by-token-repository";
import DbFindAccountByToken from "./db-find-account-by-token";

function createFakeAccount(): AccountModel {
  return {
    id: "any_id",
    email: "any_email@mail.com",
    password: "hashed_password",
    name: "any_name",
  };
}

function createDecrypter(): Decrypter {
  class DecrypterStub implements Decrypter {
    async decrypt(): Promise<string> {
      return Promise.resolve("any_value");
    }
  }
  return new DecrypterStub();
}

function createFindAccountByRepositoryStub(): FindAccountByTokenRepository {
  class FindAccountByRepositoryStub implements FindAccountByTokenRepository {
    async findByToken(): Promise<AccountModel | null> {
      return Promise.resolve(createFakeAccount());
    }
  }
  return new FindAccountByRepositoryStub();
}

type SutTypes = {
  sut: DbFindAccountByToken;
  decrypterStub: Decrypter;
  findAccountByRepositoryStub: FindAccountByTokenRepository;
};

function createSut(): SutTypes {
  const decrypterStub = createDecrypter();
  const findAccountByRepositoryStub = createFindAccountByRepositoryStub();
  const sut = new DbFindAccountByToken(decrypterStub, findAccountByRepositoryStub);
  return {
    sut,
    decrypterStub,
    findAccountByRepositoryStub,
  };
}

describe("DbFindAccountByToken UseCase", () => {
  it("should call Decrypter with correct values", async () => {
    const { sut, decrypterStub } = createSut();
    const decryptSpy = jest.spyOn(decrypterStub, "decrypt");

    await sut.findByToken("any_token", "any_role");

    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });

  it("should return null if Decrypter returns null", async () => {
    const { sut, decrypterStub } = createSut();
    jest.spyOn(decrypterStub, "decrypt").mockReturnValueOnce(Promise.resolve(null));

    const account = await sut.findByToken("any_token");

    expect(account).toBeNull();
  });

  it("should throw if Decrypter throws", async () => {
    const { sut, decrypterStub } = createSut();
    jest
      .spyOn(decrypterStub, "decrypt")
      .mockReturnValueOnce(Promise.reject(new Error("Decrypt error")));

    await expect(sut.findByToken("any_token")).rejects.toThrow(new Error("Decrypt error"));
  });

  it("should call FindAccountByTokenRepository with correct values", async () => {
    const { sut, findAccountByRepositoryStub, decrypterStub } = createSut();
    jest.spyOn(decrypterStub, "decrypt").mockReturnValueOnce(Promise.resolve("decrypted_token"));
    const findByTokenSpy = jest.spyOn(findAccountByRepositoryStub, "findByToken");

    await sut.findByToken("any_token", "any_role");

    expect(findByTokenSpy).toHaveBeenCalledWith("decrypted_token", "any_role");
  });

  it("should return null if FindAccountByTokenRepository returns null", async () => {
    const { sut, findAccountByRepositoryStub } = createSut();
    jest
      .spyOn(findAccountByRepositoryStub, "findByToken")
      .mockReturnValueOnce(Promise.resolve(null));

    const account = await sut.findByToken("any_token");

    expect(account).toBeNull();
  });

  it("should throw if Decrypter throws", async () => {
    const { sut, findAccountByRepositoryStub } = createSut();
    jest
      .spyOn(findAccountByRepositoryStub, "findByToken")
      .mockReturnValueOnce(Promise.reject(new Error("FindAccountByTokenRepository error")));

    await expect(sut.findByToken("any_token")).rejects.toThrow(
      new Error("FindAccountByTokenRepository error"),
    );
  });

  it("should return an account on success", async () => {
    const { sut } = createSut();

    const account = await sut.findByToken("any_token");

    expect(account).toEqual(createFakeAccount());
  });
});
