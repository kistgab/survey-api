import express, { Express } from "express";
import { resolve } from "path";

export default function setupStaticFiles(app: Express): void {
  // eslint-disable-next-line import/no-named-as-default-member
  app.use("/static", express.static(resolve(__dirname, "../../static")));
}
