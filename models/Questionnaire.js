var bookshelf = require('../config/bookshelf');
var user = require('./User');
var question = require('./Question');
var questionnaireUser = require('./QuestionnaireUser');
var _ = require('lodash')

var Questionnaire = bookshelf.Model.extend({
  tableName: 'questionnaires',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(user);
  },
  questions: function() {
    return this.hasMany(question, 'questionnaireId');
  },
  questionnaireUsers: function() {
    return this.hasMany(questionnaireUser, 'questionnaireId')
  }
}, {
  dependents: ['questions']
});

module.exports = Questionnaire;
