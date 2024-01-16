import { InputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import Encrypter from "../../protocols/encrypter";
import DbAddAccount from "./db-add-account";

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
};

function createEncrypterStub(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return Promise.resolve("hashed_password");
    }
  }
  return new EncrypterStub();
}

function createSut(): SutTypes {
  const encrypterStub = createEncrypterStub();
  return { sut: new DbAddAccount(encrypterStub), encrypterStub };
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
});
