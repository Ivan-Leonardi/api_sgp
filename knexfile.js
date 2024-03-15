//Configurando o knex e definindo o SQlite como bando de dados

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const knexConfig = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      waitForConnections: true,
    },
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
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
