import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";
import knex from "../database/knex/index.js";
class UserController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const checkUserExists = await knex("users").where({ email }).first();
    // const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if (checkUserExists) {
      throw new AppError("Este email já está em uso.");
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    await knex("users").insert({ name, email, password: hashedPassword });
    // await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const user_id = req.user.id;

    // const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    const user = await knex("users").select("*").where("id", user_id).first();

    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }

    // const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    const userWithUpdateEmail = await knex("users")
      .select("*")
      .where("email", email)
      .first();

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new AppError("Este email já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova senha!"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await bcrypt.compare(
        old_password,
        user.password
      );

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await bcrypt.hash(password, 8);
    }

    // await database.run(`UPDATE users SET name = ?, email = ?, password = ?, updated_at = DATETIME('now') WHERE id = ?`,
    // [user.name, user.email, user.password, user_id]);

    await knex("users").where("id", user_id).update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: knex.fn.now(),
    });

    return res.status(200).json();
  }
}

export default UserController;

// class UserController {
//     constructor(database) {
//         this.database = new sqliteConnection();
//     }

//     async create(req, res) {
//         try {
//             const { name, email, password } = req.body;

//             const user = await this.database.get("SELECT * FROM users WHERE email = ?", [email]);

//             if (user) {
//                 throw new AppError("Este email já está em uso.");
//             }

//             const hashedPassword = await bcrypt.hash(password, 8);

//             await this.database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

//             return res.status(201).json();
//         } catch (error) {
//             console.error("Error in createUser:", error);
//             return res.status(500).json({ error: "Internal Server Error" });
//         }
//     }

//     async update(req, res) {
//         try {
//             const { name, email } = req.body;
//             const { id } = req.params;

//             const user = await this.database.get("SELECT * FROM users WHERE id = (?)", [id]);

//             if (!user) {
//                 throw new AppError("Usuário não encontrado.");
//             }

//             const userWithUpdateEmail = await this.database.get("SELECT * FROM users WHERE email = (?)", [email]);

//             if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
//                 throw new AppError("Este email já está em uso.");
//             }

//             user.name = name;
//             user.email = email;

//             await this.database.run(`UPDATE users SET name = ?, email = ?, updated_at = ? WHERE id = ?`,
//             [user.name, user.email, new Date(), id]);

//             return res.status(200).json();
//         } catch (error) {
//             console.error("Error in updatedUser:", error);
//             return res.status(500).json({ error: "Internal Server Error" });
//         }

//     }
// }

// export default UserController;
