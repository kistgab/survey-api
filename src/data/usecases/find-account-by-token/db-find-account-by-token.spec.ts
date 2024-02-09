import Decrypter from "../../protocols/cryptography/decrypter";
import DbFindAccountByToken from "./db-find-account-by-token";
describe("DbFindAccountByToken UseCase", () => {
  it("should call Decrypter with correct values", async () => {
    class DecrypterStub implements Decrypter {
      async decrypt(): Promise<string> {
        return Promise.resolve("any_value");
      }
    }
    const decrypterStub = new DecrypterStub();
    const sut = new DbFindAccountByToken(decrypterStub);
    const decryptSpy = jest.spyOn(decrypterStub, "decrypt");

    await sut.findByToken("any_token");

    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });
});
