var bookshelf = require('../config/bookshelf');

var QuestionType = bookshelf.Model.extend({
  tableName: 'questionTypes',
  hasTimestamps: true,
});

module.exports = QuestionType;
