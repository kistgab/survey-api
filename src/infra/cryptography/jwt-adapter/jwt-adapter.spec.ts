import * as jwt from "jsonwebtoken";
import JwtAdapter from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("any_jwt"),
  verify: jest.fn().mockReturnValue("any_value"),
}));

function createSut(): JwtAdapter {
  return new JwtAdapter("secret_key");
}

describe("JWT Adapter", () => {
  describe("sign", () => {
    it("should call sign with correct values", async () => {
      const sut = createSut();
      const signSpy = jest.spyOn(jwt, "sign");

      await sut.encrypt("any_id");

      expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret_key");
    });

    it("should return a token on sign success", async () => {
      const sut = createSut();

      const token = await sut.encrypt("any_id");

      expect(token).toBe("any_jwt");
    });

    it("should throw if sign throws", async () => {
      const sut = createSut();
      jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
        throw new Error("any_sign_error");
      });

      await expect(sut.encrypt("any_id")).rejects.toThrow("any_sign_error");
    });
  });

  describe("verify", () => {
    it("should call verify with correct values", async () => {
      const sut = createSut();
      const verifySpy = jest.spyOn(jwt, "verify");

      await sut.decrypt("any_token");

      expect(verifySpy).toHaveBeenCalledWith("any_token", "secret_key");
    });

    it("should return a value on verify success", async () => {
      const sut = createSut();

      const result = await sut.decrypt("any_token");

      expect(result).toEqual("any_value");
    });

    it("should throw if verify throws", async () => {
      const sut = createSut();
      jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
        throw new Error("any_verify_error");
      });

      await expect(sut.decrypt("any_token")).rejects.toThrow("any_verify_error");
    });
  });
});
