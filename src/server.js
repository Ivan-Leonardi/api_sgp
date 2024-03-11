//Criação da configuração do arquivo inicial e do servidor com Express, do projeto backend

import "express-async-errors";
import "dotenv/config";
import MigrationRunner from "./database/sqlite/migrations/index.js";
import AppError from "./utils/AppError.js";
import express from "express";
import uploadConfig from "./configs/upload.js";
import cors from "cors";
import routes from "./routes/index.js";
import Migrate from "./database/knex/migrate.js";

const migrationRun = new MigrationRunner();

migrationRun.run();
Migrate().then(console.log("migrate init"))

const app = express();

app.use(cors());

app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.log(error);

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT} 🚀`);
});
