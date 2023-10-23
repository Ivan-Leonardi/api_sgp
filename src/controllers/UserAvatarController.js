import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";
import DiskStorage from "../providers/DiskStorage.js";

class UserAvatarController {
    async update(req, res) {
        const user_id = req.user.id;
        const avatarFilename = req.file.filename;

        const diskStorage = new DiskStorage();

        const user = await knex("users").where({ id: user_id }).first();

        if (!user) {
            throw new AppError("Apenas usuários autenticados podem mudar a foto do perfil.", 401);
        }

        if (user.avatar) {
            await diskStorage.deleteFile(user.avatar);
        }

        const filename = await diskStorage.saveFile(avatarFilename);
        user.avatar = filename;

        await knex("users").update(user).where({ id: user_id });

        return res.json(user);
    }
}

export default UserAvatarController;