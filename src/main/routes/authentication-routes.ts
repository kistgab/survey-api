import { Router } from "express";
import { OutputAddAccountDto } from "../../domain/dtos/add-account-dto";
import { RequestSignUpBody } from "../../presentation/controllers/signup/signup-controller";
import adaptRoute from "../adapters/express/express-route-adapter";
import SignUpControllerFactory from "../factories/signup/signup-controller-factory";

export default (router: Router): void => {
  const controller = SignUpControllerFactory.create();
  router.post("/signup", adaptRoute<RequestSignUpBody, Error | OutputAddAccountDto>(controller));
};
