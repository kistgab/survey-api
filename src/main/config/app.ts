import setupMiddlewares from "@src/main/config/middlewares";
import setupRoutes from "@src/main/config/routes";
import * as dotenv from "dotenv";
import express from "express";

dotenv.config();
const app = express();
setupMiddlewares(app);
setupRoutes(app);
export default app;
