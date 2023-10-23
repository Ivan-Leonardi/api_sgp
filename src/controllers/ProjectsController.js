import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

class ProjectsController {
    async create(req, res) {
        const { title, expected_date, status, developers } = req.body;
        const user_id = req.user.id;

        const expectedDate = new Date(expected_date);

        if (isNaN(expectedDate) || expectedDate < new Date()) {
            throw new AppError("O formato da data é inválido ou anterior à data atual!");
        }

        const [project_id] = await knex("projects").insert({
            title,
            expected_date: expectedDate,
            status,
            user_id
        });

        const developersInsert = developers.map(name => {
           return {
            project_id,
            name,
            user_id,            
           }
        });

        await knex("developers").insert(developersInsert);

        return res.json();
    }

    async show(req, res) {
        const { id } = req.params;

        const project = await knex("projects").where({ id }).first();
        const developers = await knex("developers").where({ project_id: id }).orderBy("name");

        return res.json({
            ...project,
            developers
        });
    }
    
    async delete(req, res) {
        const { id } = req.params;
        
        await knex("projects").where({ id }).delete();

        return res.json();
    }

    async index(req, res) {
        const { title, developers } = req.query;
        const user_id = req.user.id;

        let projects;

        if (developers) {
            const filterDevelopers = developers.split(',').map(devs => devs.trim());

            projects = await knex("developers")
            .select([
                "projects.id",
                "projects.title",
                "projects.user_id",
            ])
            .where("projects.user_id", user_id)
            .whereLike("projects.title", `%${title}%`)            
            .whereIn("name", filterDevelopers)
            .innerJoin("projects", "projects.id", "developers.project_id")
        } else {
            projects = await knex("projects")
            .where({ user_id })
            .whereLike("title", `%${title}%`)
            .orderBy("created_at");
        } 
        
        const userDevelopers = await knex("developers").where({ user_id });
        const projectsWithDevelopers = projects.map(project => {
            const projectDevelopers = userDevelopers.filter(devs => devs.project_id === project.id);

            return {
                ...project,
                developers: projectDevelopers
            }
        })

        return res.json({ projectsWithDevelopers });
    }
}

export default ProjectsController;