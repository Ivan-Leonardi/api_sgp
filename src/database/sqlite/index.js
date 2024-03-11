//Realiazando a conexão com SQlite

import sqlite3 from "sqlite3";
import * as sqlite from "sqlite";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sqliteConnection() {
    const database = await sqlite.open({
        filename: path.resolve(__dirname, "..", "database.db"),
        driver: sqlite3.Database
    });

    return database;
}

export default sqliteConnection;