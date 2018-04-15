var bookshelf = require('../config/bookshelf');
var user = require('./User');
var question = require('./Question');
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
});

module.exports = Questionnaire;

