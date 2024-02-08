import { Router } from "express";
import adaptRoute from "../../adapters/express/express-route-adapter";
import AddSurveyControllerFactory from "../../factories/controllers/survey/add-survey/add-survey-controller-factory";

export default function surveyRoutes(router: Router): void {
  router.post("/surveys", adaptRoute(AddSurveyControllerFactory.create()));
}
