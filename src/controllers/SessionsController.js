import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import AuthConfig from "../configs/AuthConfig.js";
import Jwt from "jsonwebtoken";

class SessionsController {
    async create(req, res) {
        const { email, password } = req.body;

        const user = await knex("users").where({ email }).first();

        if (!user) {
            throw new AppError("Email e/ou senha incorreta.", 401);
        }

        const passwordMatched = await bcrypt.compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError("Email e/ou senha incorreta.", 401);
        }

        const authConfig = new AuthConfig();

        const { secret, expiresIn } = authConfig;

        const token = Jwt.sign({}, secret, {
            subject: String(user.id),
            expiresIn
        });

        return res.json({ user, token });
    }
}

export default SessionsController;