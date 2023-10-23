import knex from "../database/knex/index.js";

class DevelopersController {
    async index(req, res) {
        const user_id = req.user.id;

        const developers = await knex("developers").where({ user_id });

        return res.json(developers);
    }
}

export default DevelopersController;