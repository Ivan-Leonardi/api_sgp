import { Router } from "express";

import usersRouter from "./users.routes.js";
import sessionsRouter from "./sessions.routes.js";
import projectsRouter from "./projects.routes.js";
import developersRouter from "./developers.routes.js";

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/projects", projectsRouter);
routes.use("/developers", developersRouter);

export default routes;