exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('questionnaires', function(table) {
        table.increments()
        table.string('title');
        table.text('description');
        table.integer('userId').references('users.id').onDelete('CASCADE');
        table.timestamps();        
      })
    ]);
  };
  
  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('questionnaires')
    ])
  };
  