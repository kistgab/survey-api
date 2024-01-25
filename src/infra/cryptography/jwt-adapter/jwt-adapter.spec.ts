import * as jwt from "jsonwebtoken";
import JwtAdapter from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("any_jwt"),
}));

describe("JWT Adapter", () => {
  it("should call sign with correct values", async () => {
    const sut = new JwtAdapter("secret_key");
    const signSpy = jest.spyOn(jwt, "sign");

    await sut.encrypt("any_id");

    expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret_key");
  });

  it("should return a token on sign success", async () => {
    const sut = new JwtAdapter("secret_key");

    const token = await sut.encrypt("any_id");

    expect(token).toBe("any_jwt");
  });
});
