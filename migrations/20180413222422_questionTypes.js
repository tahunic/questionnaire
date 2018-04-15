exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('questionTypes', function(table) {
        table.increments()
        table.string('name');
        table.timestamps();        
      })
    ]);
  };
  
  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('questionTypes')
    ])
  };
  