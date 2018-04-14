exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('questions', function(table) {
        table.increments()
        table.text('title');
        table.integer('questionnaireId').references('questionnaires.id');
        table.integer('questionTypeId').references('questionTypes.id');
      })
    ]);
  };
  
  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('questions')
    ])
  };
  