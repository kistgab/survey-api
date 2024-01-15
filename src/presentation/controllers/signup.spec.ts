/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import SignUpController from "./signup";

describe("SignUp Controller", () => {
  it("Should return 422 when name is not provided", () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
  });
});
