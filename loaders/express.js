import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import authenticate from "../middlewares/authenticate.js";

import { protectedRouter, unProtectedRouter } from "../routes/index.js";

export default async function expressLoader({ app }) {
  app.use(cors());
  app.use(helmet());
  app.use(express.static("public"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use(bodyParser.urlencoded());

  app.use("/", unProtectedRouter);
  app.use("/api", authenticate, protectedRouter);
}
