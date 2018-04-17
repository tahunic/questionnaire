exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('questionnairesUsers', function(table) {
        table.increments();        
        table.integer('questionnaireId').references('questionnaires.id').onDelete('CASCADE');
        table.integer('userId').references('users.id').onDelete('CASCADE');
        table.timestamps();        
      })
    ]);
  };
  
  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('questionnairesUsers')
    ])
  };
  