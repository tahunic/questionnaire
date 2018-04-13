var bookshelf = require('../config/bookshelf');
var user = require('./User');

var Questionnaire = bookshelf.Model.extend({
  tableName: 'questionnaires',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(user);
  }
});

module.exports = Questionnaire;
