import { Router } from "express";
import adaptMiddleware from "../../adapters/express-middleware-adapter";
import adaptRoute from "../../adapters/express-route-adapter";
import AddSurveyControllerFactory from "../../factories/controllers/survey/add-survey/add-survey-controller-factory";
import AuthMiddlewareFactory from "../../factories/middlewares/auth-middleware-factory";

export default function surveyRoutes(router: Router): void {
  const adminAuth = adaptMiddleware(AuthMiddlewareFactory.create("admin"));
  router.post("/surveys", adminAuth, adaptRoute(AddSurveyControllerFactory.create()));
}
