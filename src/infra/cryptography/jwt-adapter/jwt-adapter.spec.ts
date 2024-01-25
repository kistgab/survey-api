import * as jwt from "jsonwebtoken";
import JwtAdapter from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("jwt"),
}));

describe("JWT Adapter", () => {
  it("should call sign with correct values", async () => {
    const sut = new JwtAdapter("secret_key");
    const signSpy = jest.spyOn(jwt, "sign");

    await sut.encrypt("any_id");

    expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret_key");
  });
});
