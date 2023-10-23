import sqliteConnection from "../../sqlite/index.js";
import createUsers from "./createUsers.js";

class MigrationRunner {
    constructor() {
        this.schemas = [
            createUsers
        ].join('');
    }

    async run() {
        try {
            const db = await this.connectToDatabase();
            await this.executeMigrations(db);
        } catch (error) {
            console.log(error);
        }
    }

    async connectToDatabase() {
        return sqliteConnection(); // Chamar a função de conexão com o banco de dados
    }

    async executeMigrations(db) {
        const schemas = this.schemas;

        return db.exec(schemas)
            .then(() => {
                console.log('Migrations executed successfully');
            })
            .catch(error => {
                console.log('Migrations failed:', error);
            });
    }
}

export default MigrationRunner;

// async function migrationRun() {
//     const schemas = [
//         createUsers
//     ].join('');

//     sqliteConnection()
//     .then(db => db.exec(schemas))
//     .catch(error => console.log(error));
// }

// export default migrationRun;