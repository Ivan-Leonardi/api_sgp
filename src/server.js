//Criação da configuração do arquivo inicial e do servidor com Express, do projeto backend

import "express-async-errors";
import "dotenv/config";
import AppError from "./utils/AppError.js";
import express from "express";
import uploadConfig from "./configs/upload.js";
import cors from "cors";
import routes from "./routes/index.js";
import connection from "./database/knex/index.js";

const app = express();

app.use(cors({
  origin: [
    "https://sgpdev.vercel.app/",
    "https://sgpdev.vercel.app/register",
    "https://sgpdev.vercel.app/users",
    "https://sgpdev.vercel.app/projects",
    "https://sgpdev.vercel.app/sessions",
    "https://sgpdev.vercel.app/developers"
  ] 
}));

app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

connection.queryBuilder();

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
