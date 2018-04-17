var bookshelf = require('../config/bookshelf');
// var user = require('./User');

var AnswerUser = bookshelf.Model.extend({
  tableName: 'answersUsers',
  hasTimestamps: true,
  // users: function() {
  //   return this.belongsTo(user);
  // }
});

module.exports = AnswerUser;
