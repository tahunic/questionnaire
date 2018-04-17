exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('answersUsers', function(table) {
        table.increments();        
        table.integer('answerId').references('answers.id').onDelete('CASCADE');
        table.integer('userId').references('users.id').onDelete('CASCADE');
        table.text('text');
        table.timestamps();
      })
    ]);
  };
  
  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('answersUsers')
    ])
  };
  