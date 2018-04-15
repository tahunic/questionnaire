var Questionnaire = require('../models/Questionnaire');
var Question = require('../models/Question');
var Answer = require('../models/Answer');
var config = require('../knexfile');
var knex = require('knex')(config);
/**
 * GET /questionnaries
 */
exports.questionnaireGet = function (req, res) {
  Questionnaire.collection().fetch({
    columns: ['id', 'title', 'description']
  })
    .then((response) => {
      res.send(response);
    })
    .catch(function (err) {
      console.log(err);
      return res.status(500);
    });
};

/**
 * GET /questionnaries/5
 */
exports.questionnaireGetById = function (req, res) {
  Questionnaire.where({id: req.params.id })
  .fetch({withRelated: ['questions', 'questions.answers']})
    .then((response) => {
      res.send(response);
    })
    .catch(function (err) {
      console.log(err);
      return res.status(500);
    });
};

/**
 * POST /questionnaire
 */
exports.questionnairePost = function (req, res) {
  req.assert('title', 'Title cannot be blank').notEmpty();
  req.assert('questions', 'Please add at least one question').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  new Questionnaire({
    title: req.body.title,
    description: req.body.description,
    userId: req.user.id,
  }).save()
    .then(function (response) {
      req.body.questions.map(question => {
        new Question({
          title: question.title,
          questionTypeId: question.questionTypeId,
          questionnaireId: response.id
        }).save()
          .then(function (response) {
            question.answers.map(answer => {
              new Answer({
                title: answer.title,
                questionId: response.id
              }).save()
                .then(function (response) {

                })
                .catch(function (err) {
                  console.log(err);
                  return res.status(500);
                });
            });
          })
          .catch(function (err) {
            console.log(err);
            return res.status(500);
          });
      });
      res.send({ msg: 'New questionnaire successfully added.' });

    })
    .catch(function (err) {
      console.log(err);
      return res.status(500);
    });

};


// /**
//  * GET /questionnaries
//  */
// exports.questionnaireGet = function (req, res) {
//   Questionnaire.collection().fetch({withRelated: ['questions', 'questions.answers']})
//     .then((response) => {
//       res.send(response);
//     })
//     .catch(function (err) {
//       console.log(err);
//       return res.status(500);
//     });
// };