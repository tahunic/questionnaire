var QuestionType = require('../models/QuestionType');

/**
 * GET /contact
 */
exports.questionTypeGet = function (req, res) {
  
    new QuestionType().fetchAll()
        .then((response) => {
            console.log(response);
        });
};
