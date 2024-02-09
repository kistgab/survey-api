import AccountModel from "../../models/account-model";
import Decrypter from "../../protocols/cryptography/decrypter";
import FindAccountByTokenRepository from "./../../../data/protocols/db/account/find-account-by-token-repository";
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

  it("should call FindAccountByTokenRepository with correct values", async () => {
    const { sut, findAccountByRepositoryStub } = createSut();
    const findByTokenSpy = jest.spyOn(findAccountByRepositoryStub, "findByToken");

    await sut.findByToken("any_token", "any_role");

    expect(findByTokenSpy).toHaveBeenCalledWith("any_token", "any_role");
  });
});
