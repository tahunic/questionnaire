var QuestionType = require('../models/QuestionType');

/**
 * GET /questiontype
 */
exports.questionTypeGet = function (req, res) {
    QuestionType.collection().fetch({
        columns: ['id', 'name']
    })
    .then((response) => {
        res.send(response);
    })
    .catch(function(err) {
        console.log(err);
        return res.status(500);
    });
};
