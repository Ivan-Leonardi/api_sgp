//Exportando a conexão do knex

import knexConfig from "../../../knexfile.js";
import knex from "knex";

const connection = knex(knexConfig.development);

export default connection;