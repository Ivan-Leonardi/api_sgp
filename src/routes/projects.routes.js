import { Router } from "express";
import ProjectsController from "../controllers/ProjectsController.js";
import EnsureAuthenticated from "../middlewares/EnsureAuthenticated.js";

const projectsRoutes = Router();

const ensureAuthenticated = new EnsureAuthenticated();

const projectsController = new ProjectsController();

projectsRoutes.use(ensureAuthenticated.middlewareAuthenticated);

projectsRoutes.post("/", projectsController.create);
projectsRoutes.get("/", projectsController.index);
projectsRoutes.get("/:id", projectsController.show);
projectsRoutes.delete("/:id", projectsController.delete);

export default projectsRoutes;