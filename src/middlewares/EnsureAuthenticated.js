//Criação de um middleware de autenticação, para verificar se existe o token do usuário

import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import AuthConfig from "../configs/AuthConfig.js";

class EnsureAuthenticated {  
    middlewareAuthenticated(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError("JWT Token não informado", 401);
        }

        const [, token] = authHeader.split(" ");

        try {
           const authConfig = new AuthConfig();
            
            const { sub: user_id } = jwt.verify(token, authConfig.secret);

            req.user = {
                id: Number(user_id),
            };

            return next();
        } catch {            
            throw new AppError("JWT Token inválido");
        }
    }
}

export default EnsureAuthenticated;