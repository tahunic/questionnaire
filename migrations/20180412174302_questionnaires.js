exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('questionnaires', function(table) {
        table.increments()
        table.string('question');
        table.integer('userId').references('users.id');
      })
    ]);
  };
  
  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('questionnaires')
    ])
  };
  