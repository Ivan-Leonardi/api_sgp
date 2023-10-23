import { Router } from "express";

import SessionsController from "../controllers/SessionsController.js";

const sessionsController = new SessionsController();

const sessionsRoutes = Router();

sessionsRoutes.post("/", sessionsController.create);

export default sessionsRoutes;
