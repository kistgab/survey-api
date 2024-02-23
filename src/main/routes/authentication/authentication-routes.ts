import adaptRoute from "@src/main/adapters/express-route-adapter";
import LoginControllerFactory from "@src/main/factories/controllers/authentication/login/login-controller-factory";
import SignUpControllerFactory from "@src/main/factories/controllers/authentication/signup/signup-controller-factory";
import { Router } from "express";

export default function authenticationRoutes(router: Router): void {
  router.post("/signup", adaptRoute(SignUpControllerFactory.create()));
  router.post("/login", adaptRoute(LoginControllerFactory.create()));
}
