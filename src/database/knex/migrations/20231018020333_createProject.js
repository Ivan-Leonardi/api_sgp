//Criação da tabale projects, aqui utilizei o Knex pora criar a tabela

export const up = knex => knex.schema.createTable("projects", table => {
    table.increments("id");
    table.text("title");    
    table.dateTime("expected_date");
    table.text("status");
    table.integer("user_id").references("id").inTable("users");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());  
}); 

export const down = knex => knex.schema.dropTable("projects"); 

