import { Router } from "express";
import { OutputAddAccountDto } from "../../domain/dtos/add-account-dto";
import { RequestSignUpBody } from "../../presentation/controllers/signup/signup-controller";
import adaptRoute from "../adapters/express/express-route-adapter";
import LoginControllerFactory from "../factories/login/login-controller-factory";
import SignUpControllerFactory from "../factories/signup/signup-controller-factory";

export default function authenticationRoutes(router: Router): void {
  router.post(
    "/signup",
    adaptRoute<RequestSignUpBody, Error | OutputAddAccountDto>(SignUpControllerFactory.create()),
  );
  router.post("/login", adaptRoute(LoginControllerFactory.create()));
}
