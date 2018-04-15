var bookshelf = require('../config/bookshelf');

var Answer = bookshelf.Model.extend({
  tableName: 'answers',
  hasTimestamps: true,
});

module.exports = Answer;
