var bookshelf = require('../config/bookshelf');
var answerUser = require('../models/AnswerUser');

var Answer = bookshelf.Model.extend({
  tableName: 'answers',
  hasTimestamps: true,
  answersUsers: function () {
    // var answerUser = bookshelf.model('AnswerUser'); 

    return this.hasMany(answerUser, 'answerId');
  }
}, {
    dependents: ['answersUsers']
  });

module.exports = Answer;
