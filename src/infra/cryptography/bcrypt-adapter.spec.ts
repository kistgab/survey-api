import bcrypt from "bcrypt";
import BCryptAdapter from "./bcrypt-adapter";

type SutTypes = {
  salt: number;
  sut: BCryptAdapter;
};

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return Promise.resolve("hash");
  },
}));

const createSut = (): SutTypes => {
  const salt = 12;
  const sut = new BCryptAdapter(salt);
  return { salt, sut };
};

describe("BCrypt Adapter", () => {
  it("should call BCrypt with the specified value", async () => {
    const { sut, salt } = createSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");

    await sut.hash("any_value");

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  it("should return the hash value", async () => {
    const { sut } = createSut();

    const result = await sut.hash("any_value");

    expect(result).toBe("hash");
  });

  it("should throw when bcrypt throws", async () => {
    const { sut } = createSut();
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
      throw new Error("bcrypt_error");
    });

    await expect(async () => {
      await sut.hash("any_value");
    }).rejects.toThrow();
  });
});
