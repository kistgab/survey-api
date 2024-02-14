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

  compare: jest.fn().mockImplementation(async () => Promise.resolve(true)),
}));

const createSut = (): SutTypes => {
  const salt = 12;
  const sut = new BCryptAdapter(salt);
  return { salt, sut };
};

describe("BCrypt Adapter", () => {
  describe("hash", () => {
    it("should call BCrypt Hash with the specified value", async () => {
      const { sut, salt } = createSut();
      const hashSpy = jest.spyOn(bcrypt, "hash");

      await sut.hash("any_value");

      expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
    });

    it("should return the hash value on success", async () => {
      const { sut } = createSut();

      const result = await sut.hash("any_value");

      expect(result).toBe("hash");
    });

    it("should throw when BCrypt Hash throws", async () => {
      const { sut } = createSut();
      jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
        throw new Error("hash_error");
      });

      await expect(async () => {
        await sut.hash("any_value");
      }).rejects.toThrow("hash_error");
    });
  });

  describe("compare", () => {
    it("should call BCrypt compare with the specified values", async () => {
      const { sut } = createSut();
      const compareSpy = jest.spyOn(bcrypt, "compare");

      await sut.compare("any_value", "any_hash");

      expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
    });

    it("should return true when compare succeeds", async () => {
      const { sut } = createSut();

      const result = await sut.compare("any_value", "any_hash");

      expect(result).toBeTruthy();
    });

    it("should return false when BCrypt compare fails", async () => {
      const { sut } = createSut();
      // @ts-expect-error - idk why it throws this error, but it works
      jest.spyOn(bcrypt, "compare").mockReturnValueOnce(false);

      const result = await sut.compare("any_value", "any_value");

      expect(result).toBeFalsy();
    });

    it("should throw when BCrypt compare throws", async () => {
      const { sut } = createSut();
      jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
        throw new Error("compare_error");
      });

      await expect(async () => {
        await sut.compare("any_value", "any_hash");
      }).rejects.toThrow("compare_error");
    });
  });
});
