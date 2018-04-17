exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('questions', function(table) {
        table.increments()
        table.text('title');
        table.integer('questionnaireId').references('questionnaires.id').onDelete('CASCADE');
        table.integer('questionTypeId').references('questionTypes.id').onDelete('CASCADE');
        table.timestamps();        
      })
    ]);
  };
  
  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('questions')
    ])
  };
  