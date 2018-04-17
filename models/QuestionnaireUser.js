var bookshelf = require('../config/bookshelf');
var user = require('./User');

var QuestionnaireUser = bookshelf.Model.extend({
  tableName: 'questionnairesUsers',
  hasTimestamps: true,
  users: function() {
    return this.belongsTo(user);
  }
});

module.exports = QuestionnaireUser;
