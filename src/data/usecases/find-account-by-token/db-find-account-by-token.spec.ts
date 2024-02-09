import Decrypter from "../../protocols/cryptography/decrypter";
import DbFindAccountByToken from "./db-find-account-by-token";

type SutTypes = {
  sut: DbFindAccountByToken;
  decrypterStub: Decrypter;
};

function createDecrypter(): Decrypter {
  class DecrypterStub implements Decrypter {
    async decrypt(): Promise<string> {
      return Promise.resolve("any_value");
    }
  }
  const decrypterStub = new DecrypterStub();
  return decrypterStub;
}

function createSut(): SutTypes {
  const decrypterStub = createDecrypter();
  const sut = new DbFindAccountByToken(decrypterStub);
  return {
    sut,
    decrypterStub,
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
});
