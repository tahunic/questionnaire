var bookshelf = require('../config/bookshelf');
var user = require('./User');
var questionnaire = require('./Questionnaire');

var QuestionType = bookshelf.Model.extend({
  tableName: 'questionnairesUsers',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(user);
  },
  questionnaire: function() {
      return this.belongsTo(questionnaire)
  }
});

module.exports = QuestionType;
