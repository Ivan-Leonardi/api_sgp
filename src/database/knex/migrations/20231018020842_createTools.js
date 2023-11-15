//Criação da tabale developers, aqui utilizei o Knex pora criar a tabela

export const up = knex => knex.schema.createTable("developers", table => {
    table.increments("id");
    table.text("name").notNullable();         
    table.integer("project_id").references("id").inTable("projects").onDelete("CASCADE");      
    table.integer("user_id").references("id").inTable("users");      
}); 

export const down = knex => knex.schema.dropTable("developers"); 


