//Configurando o knex e definindo o SQlite como bando de dados
import "dotenv/config";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knexConfig = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.MYSQL_ADDON_HOST,
      port: parseInt(process.env.MYSQL_ADDON_PORT),
      database: process.env.MYSQL_ADDON_DB,
      user: process.env.MYSQL_ADDON_USER,
      password: process.env.MYSQL_ADDON_PASSWORD,      
    },    
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    },
    useNullAsDefault: true
  }
};

export default knexConfig;


// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const knexConfig = {
//   development: {
//     client: 'sqlite3',
//     connection: {
//       filename: path.resolve(__dirname, "src", "database", "database.db")
//     },
//     pool: {
//       afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
//     },
//     migrations: {
//       directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
//     },
//     useNullAsDefault: true
//   }
// };

// export default knexConfig;
