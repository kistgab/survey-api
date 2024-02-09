import * as jwt from "jsonwebtoken";
import JwtAdapter from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("any_jwt"),
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
});
