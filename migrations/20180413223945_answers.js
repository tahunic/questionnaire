exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('answers', function(table) {
        table.increments()
        table.text('title');
        table.integer('questionId').references('questions.id');
        table.timestamps();
      })
    ]);
  };
  
  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('answers')
    ])
  };
  