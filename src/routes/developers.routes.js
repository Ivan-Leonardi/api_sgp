import { Router } from "express";
import DevelopersController from "../controllers/DevelopersController.js";
import EnsureAuthenticated from "../middlewares/EnsureAuthenticated.js";

const developersRoutes = Router();

const ensureAuthenticated = new EnsureAuthenticated();

const developersController = new DevelopersController();

developersRoutes.get("/", ensureAuthenticated.middlewareAuthenticated, developersController.index);

export default developersRoutes;