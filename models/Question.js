var bookshelf = require('../config/bookshelf');
var questionType = require('../models/QuestionType');
var answer = require('../models/Answer');

var Question = bookshelf.Model.extend({
  tableName: 'questions',
  hasTimestamps: true,
  questionType: function() {
      return this.belongsTo(questionType)
  },
  answers: function() {
    return this.hasMany(answer, 'questionId');
  }
}, {
  dependents: ['answers']
});

module.exports = Question;
