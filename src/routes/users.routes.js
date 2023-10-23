import { Router } from "express";
import multer from "multer";
import uploadConfig from "../configs/upload.js";
import UserController from "../controllers/UsersController.js";
import UserAvatarController from "../controllers/UserAvatarController.js";
import EnsureAuthenticated from "../middlewares/EnsureAuthenticated.js";

const ensureAuthenticated = new EnsureAuthenticated();
const userAvatarController = new UserAvatarController();

const usersRoutes = Router();

const upload = multer(uploadConfig.MULTER);

const userController = new UserController();

usersRoutes.post("/", userController.create);
usersRoutes.put("/", ensureAuthenticated.middlewareAuthenticated, userController.update);
usersRoutes.patch("/avatar", ensureAuthenticated.middlewareAuthenticated, upload.single("avatar"), userAvatarController.update);

export default usersRoutes;