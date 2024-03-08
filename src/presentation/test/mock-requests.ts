import { RequestSignUpBody } from "@src/presentation/controllers/authentication/signup/signup-controller";

export function mockRequestSignUpBody(): RequestSignUpBody {
  return {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  };
}
