import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

class ProjectsController {
  async create(req, res) {
    const { title, expected_date, status, developers } = req.body;
    const user_id = req.user.id;

    const expectedDate = new Date(expected_date);

    if (isNaN(expectedDate) || expectedDate < new Date()) {
      throw new AppError(
        "O formato da data é inválido ou anterior à data atual!"
      );
    }

    if (status !== "planejamento" && status !== "iniciado") {
      throw new AppError("O status deve ser 'planejamento' ou 'iniciado'.");
    }

    const [project_id] = await knex("projects").insert({
      title,
      expected_date: expectedDate,
      status,
      user_id,
    });

    if (!project_id) {
      throw new AppError("Erro ao criar o projeto.");
    }

    try {
      const developersInsert = developers.map((name) => {
        return {
          project_id,
          name,
          user_id,
        };
      });

      await knex("developers").insert(developersInsert);

      return res.json();
    } catch (error) {
      console.log("Erro:::", error);
      throw new AppError("Erro ao inserir desenvolvedores no projeto.");
    }
  }

  async show(req, res) {
    const { id } = req.params;

    const project = await knex("projects").where({ id }).first();
    const developers = await knex("developers")
      .where({ project_id: id })
      .orderBy("name");

    return res.json({
      ...project,
      developers,
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
      const filterDevelopers = developers.split(",").map((dev) => dev.trim());

      projects = await knex("developers")
        .select(["projects.id", "projects.title", "projects.user_id"])
        .where("projects.user_id", user_id)
        .whereLike("projects.title", `%${title}%`)
        .whereIn("name", filterDevelopers)
        .innerJoin("projects", "projects.id", "developers.project_id")
        .groupBy("projects.id")
        .orderBy("projects.title");
    } else {
      projects = await knex("projects")
        .where({ user_id })
        .where("title", "like", `%${title}%`) // Utilize o método "where" com o operador "like"
        .orderBy("created_at");
    }

    const userDevelopers = await knex("developers").where({ user_id });
    const projectsWithDevelopers = projects.map((project) => {
      const projectDevelopers = userDevelopers.filter(
        (dev) => dev.project_id === project.id
      );

      return {
        ...project,
        developers: projectDevelopers,
      };
    });

    return res.json({ projectsWithDevelopers });
  }

  async update(req, res) {
    const { id } = req.params;

    try {
      // Obtem o status atual do projeto
      const currentStatus = await knex("projects")
        .where({ id })
        .select("status")
        .first();

      // Verifica se o status atual é "iniciado"
      if (currentStatus && currentStatus.status === "iniciado") {
        // Atualiza o status do projeto para "finalizado" no banco de dados
        await knex("projects").where({ id }).update({ status: "finalizado" });

        // Responde com uma mensagem indicando que o projeto foi finalizado com sucesso
        return res.json({ message: "Projeto finalizado com sucesso." });
      } else {
        // Se o status atual não for "iniciado", retorna um erro
        return res
          .status(400)
          .json({
            error:
              'O projeto não pode ser finalizado, pois não está no status "iniciado".',
          });
      }
    } catch (error) {
      console.error("Erro ao finalizar o projeto:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao finalizar o projeto." });
    }
  }
}

export default ProjectsController;
