import { InputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import AccountModel from "../../models/account-model";
import AddAccountRepository from "../../protocols/add-account-repository";
import Encrypter from "../../protocols/encrypter";
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

function createEncrypterStub(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return Promise.resolve("hashed_password");
    }
  }
  return new EncrypterStub();
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
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
};

function createSut(): SutTypes {
  const encrypterStub = createEncrypterStub();
  const addAccountRepositoryStub = createAddAccountRepositoryStub();
  return {
    sut: new DbAddAccount(encrypterStub, addAccountRepositoryStub),
    encrypterStub,
    addAccountRepositoryStub,
  };
}

describe("DbAddAccount Usecase", () => {
  it("should call the encrypter with the specified plain text password", async () => {
    const { sut, encrypterStub } = createSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

    await sut.add(createFakeInputAddAccountDto());

    expect(encryptSpy).toHaveBeenCalledWith("any_password");
  });

  it("should throw if encrypter throws", async () => {
    const { sut, encrypterStub } = createSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(Promise.reject(new Error("Encrypter error")));

    await expect(sut.add(createFakeInputAddAccountDto())).rejects.toThrow("Encrypter error");
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
});
