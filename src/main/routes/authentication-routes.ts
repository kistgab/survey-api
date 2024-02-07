import { Router } from "express";
import adaptRoute from "../adapters/express/express-route-adapter";
import LoginControllerFactory from "../factories/login/login-controller-factory";
import SignUpControllerFactory from "../factories/signup/signup-controller-factory";

export default function authenticationRoutes(router: Router): void {
  router.post("/signup", adaptRoute(SignUpControllerFactory.create()));
  router.post("/login", adaptRoute(LoginControllerFactory.create()));
}
