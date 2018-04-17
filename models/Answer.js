var bookshelf = require('../config/bookshelf');

var Answer = bookshelf.Model.extend({
  tableName: 'answers',
  hasTimestamps: true,
  answersUsers: function () {
    // var answerUser = bookshelf.model('AnswerUser'); 

    return this.hasMany(require('./answerUser'), 'answerId');
  }
}, {
    dependents: ['answersUsers']
  });

module.exports = Answer;
