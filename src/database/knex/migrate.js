import knex from 'knex';
import knexConfig from '../../../knexfile.js';

const Migrate = async () => {
  const db = knex(knexConfig.development);
  await db.migrate.latest();
};

export default Migrate;