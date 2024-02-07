import { InputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import AccountModel from "../../models/account-model";
import Hasher from "../../protocols/cryptography/hasher";
import AddAccountRepository from "../../protocols/db/account/add-account-repository";
import FindAccountByEmailRepository from "../../protocols/db/account/find-account-by-email-repository";
import DbAddAccount from "./db-add-account";

function createFakeAccount(): AccountModel {
  return {
    id: "any_id",
    email: "any_email@mail.com",
    password: "hashed_password",
    name: "any_name",
  };
}

function createFakeInputAddAccountDto(): InputAddAccountDto {
  return {
    email: "any_email@mail.com",
    password: "any_password",
    name: "any_name",
  };
}

function createHasherStub(): Hasher {
  class HasherStub implements Hasher {
    async hash(): Promise<string> {
      return Promise.resolve("hashed_password");
    }
  }
  return new HasherStub();
}

function createFindAccountByEmailRepositoryStub(): FindAccountByEmailRepository {
  class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
    async findByEmail(): Promise<AccountModel | null> {
      return Promise.resolve(null);
    }
  }
  return new FindAccountByEmailRepositoryStub();
}

function createAddAccountRepositoryStub(): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(): Promise<AccountModel> {
      return Promise.resolve(createFakeAccount());
    }
  }
  return new AddAccountRepositoryStub();
}

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository;
};

function createSut(): SutTypes {
  const hasherStub = createHasherStub();
  const addAccountRepositoryStub = createAddAccountRepositoryStub();
  const findAccountByEmailRepositoryStub = createFindAccountByEmailRepositoryStub();
  return {
    sut: new DbAddAccount(hasherStub, addAccountRepositoryStub, findAccountByEmailRepositoryStub),
    hasherStub,
    findAccountByEmailRepositoryStub,
    addAccountRepositoryStub,
  };
}

describe("DbAddAccount Usecase", () => {
  it("should call the Hasher with the specified plain text password", async () => {
    const { sut, hasherStub: hasherStub } = createSut();
    const hashSpy = jest.spyOn(hasherStub, "hash");

    await sut.add(createFakeInputAddAccountDto());

    expect(hashSpy).toHaveBeenCalledWith("any_password");
  });

  it("should throw if Hasher throws", async () => {
    const { sut, hasherStub: hasherStub } = createSut();
    jest.spyOn(hasherStub, "hash").mockReturnValueOnce(Promise.reject(new Error("Hasher error")));

    await expect(sut.add(createFakeInputAddAccountDto())).rejects.toThrow("Hasher error");
  });

  it("should call the AddAccountRepository with the correct values", async () => {
    const { sut, addAccountRepositoryStub } = createSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");

    await sut.add(createFakeInputAddAccountDto());

    expect(addSpy).toHaveBeenCalledWith({
      email: "any_email@mail.com",
      name: "any_name",
      password: "hashed_password",
    });
  });

  it("should throw if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = createSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(Promise.reject(new Error("Repository error")));

    await expect(sut.add(createFakeInputAddAccountDto())).rejects.toThrow("Repository error");
  });

  it("should call the AddAccountRepository with the correct values", async () => {
    const { sut } = createSut();

    const result = await sut.add(createFakeInputAddAccountDto());

    expect(result).toEqual(createFakeAccount());
  });

  it("should call FindAccountByEmailRepository with correct email", async () => {
    const { sut, findAccountByEmailRepositoryStub } = createSut();
    const findSpy = jest.spyOn(findAccountByEmailRepositoryStub, "findByEmail");

    await sut.add(createFakeAccount());

    expect(findSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("should return null when FindAccountByEmailRepository finds", async () => {
    const { sut, findAccountByEmailRepositoryStub } = createSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "findByEmail")
      .mockReturnValueOnce(Promise.resolve(createFakeAccount()));

    const result = await sut.add(createFakeInputAddAccountDto());

    expect(result).toBeNull();
  });
});
