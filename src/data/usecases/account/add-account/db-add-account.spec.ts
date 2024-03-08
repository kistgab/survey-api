import Hasher from "@src/data/protocols/cryptography/hasher";
import AddAccountRepository from "@src/data/protocols/db/account/add-account-repository";
import FindAccountByEmailRepository from "@src/data/protocols/db/account/find-account-by-email-repository";
import { mockHasher } from "@src/data/test/mock-cryptography";
import {
  mockAddAccountRepository,
  mockFindAccountByEmailRepository,
} from "@src/data/test/mock-db-account";
import DbAddAccount from "@src/data/usecases/account/add-account/db-add-account";
import { mockAccountModel, mockInputAddAccountDto } from "@src/domain/test/mock-account";

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository;
};

function createSut(): SutTypes {
  const hasherStub = mockHasher();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const findAccountByEmailRepositoryStub = mockFindAccountByEmailRepository();
  jest
    .spyOn(findAccountByEmailRepositoryStub, "findByEmail")
    .mockReturnValue(Promise.resolve(null));
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

    await sut.add(mockInputAddAccountDto());

    expect(hashSpy).toHaveBeenCalledWith("any_password");
  });

  it("should throw if Hasher throws", async () => {
    const { sut, hasherStub: hasherStub } = createSut();
    jest.spyOn(hasherStub, "hash").mockReturnValueOnce(Promise.reject(new Error("Hasher error")));

    await expect(sut.add(mockInputAddAccountDto())).rejects.toThrow("Hasher error");
  });

  it("should call the AddAccountRepository with the correct values", async () => {
    const { sut, addAccountRepositoryStub } = createSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");

    await sut.add(mockInputAddAccountDto());

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

    await expect(sut.add(mockInputAddAccountDto())).rejects.toThrow("Repository error");
  });

  it("should return the account on success", async () => {
    const { sut } = createSut();

    const result = await sut.add(mockInputAddAccountDto());

    expect(result).toEqual(mockAccountModel());
  });

  it("should call FindAccountByEmailRepository with correct email", async () => {
    const { sut, findAccountByEmailRepositoryStub } = createSut();
    const findSpy = jest.spyOn(findAccountByEmailRepositoryStub, "findByEmail");

    await sut.add(mockAccountModel());

    expect(findSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("should return null when FindAccountByEmailRepository does not find", async () => {
    const { sut, findAccountByEmailRepositoryStub } = createSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "findByEmail")
      .mockReturnValueOnce(Promise.resolve(mockAccountModel()));

    const result = await sut.add(mockInputAddAccountDto());

    expect(result).toBeNull();
  });
});
