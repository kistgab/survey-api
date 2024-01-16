import { InputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import Encrypter from "../../protocols/encrypter";
import DbAddAccount from "./db-add-account";

describe("DbAddAccount Usecase", () => {
  it("should call the encrypter with the specified plain text password", async () => {
    class EncrypterStub implements Encrypter {
      async encrypt(): Promise<string> {
        return Promise.resolve("hashed_password");
      }
    }
    const encrypterStub = new EncrypterStub();
    const input: InputAddAccountDto = {
      email: "any_email@mail.com",
      name: "any_name",
      password: "any_password",
    };
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const sut = new DbAddAccount(encrypterStub);

    await sut.add(input);

    expect(encryptSpy).toHaveBeenCalledWith(input.password);
  });
});
