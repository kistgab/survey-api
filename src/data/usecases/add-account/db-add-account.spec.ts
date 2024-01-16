import { InputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import AccountModel from "../../models/account-model";
import AddAccountModel from "../../models/add-account-model";
import AddAccountRepository from "../../protocols/add-account-repository";
import Encrypter from "../../protocols/encrypter";
import DbAddAccount from "./db-add-account";

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
};

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
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount: AccountModel = {
        id: "any_id",
        email: accountData.email,
        name: accountData.name,
        password: accountData.password,
      };
      return Promise.resolve(fakeAccount);
    }
  }
  return new AddAccountRepositoryStub();
}

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
    const input: InputAddAccountDto = {
      email: "any_email@mail.com",
      name: "any_name",
      password: "any_password",
    };
    const { sut, encrypterStub } = createSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

    await sut.add(input);

    expect(encryptSpy).toHaveBeenCalledWith(input.password);
  });

  it("should throw if encrypter throws", async () => {
    const input: InputAddAccountDto = {
      email: "any_email@mail.com",
      name: "any_name",
      password: "any_password",
    };
    const { sut, encrypterStub } = createSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(Promise.reject(new Error("Encrypter error")));

    await expect(sut.add(input)).rejects.toThrow("Encrypter error");
  });

  it("should call the AddAccountRepository with the correct values", async () => {
    const input: InputAddAccountDto = {
      email: "any_email@mail.com",
      name: "any_name",
      password: "any_password",
    };
    const { sut, addAccountRepositoryStub } = createSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");

    await sut.add(input);

    expect(addSpy).toHaveBeenCalledWith({
      email: input.email,
      name: input.name,
      password: "hashed_password",
    });
  });

  it("should throw if AddAccountRepository throws", async () => {
    const input: InputAddAccountDto = {
      email: "any_email@mail.com",
      name: "any_name",
      password: "any_password",
    };
    const { sut, addAccountRepositoryStub } = createSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(Promise.reject(new Error("Repository error")));

    await expect(sut.add(input)).rejects.toThrow("Repository error");
  });
});
