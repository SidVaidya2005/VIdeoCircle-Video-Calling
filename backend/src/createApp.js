import express from "express";
import cors from "cors";

import usersRoutes from "./modules/users/users.routes.js";
import meetRoutes from "./modules/meet/meet.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "40kb" }));
  app.use(express.urlencoded({ limit: "40kb", extended: true }));

  app.use("/api/v1/users", usersRoutes);
  app.use("/api/v1/meet", meetRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
