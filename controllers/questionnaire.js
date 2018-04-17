var Questionnaire = require('../models/Questionnaire');
var QuestionnaireUser = require('../models/QuestionnaireUser');
var Question = require('../models/Question');
var Answer = require('../models/Answer');
var AnswerUser = require('../models/AnswerUser');
var config = require('../knexfile');
var knex = require('knex')(config);

// TODO: Implement paging

/**
 * Get all questionnaries
 * GET /questionnaries
 */
exports.questionnaireGet = function (req, res) {
  Questionnaire.collection()
    .fetch({ withRelated: ['questionnaireUsers'] })
    .then((response) => {
      res.send(response);
    })
    .catch(function (err) {
      console.log(err);
      return res.status(500);
    });
};

/**
 * Get all questionnaires created by admin
 * GET /questionnaries/admin
 */
exports.questionnaireAdminGet = function (req, res) {
  Questionnaire.where({ userId: req.user.id })
    .fetch()
    .then((response) => {
      res.send(response);
    })
    .catch(function (err) {
      console.log(err);
      return res.status(500);
    });
};

/**
 * Get questionnaire by id
 * GET /questionnaries/5
 */
exports.questionnaireGetById = function (req, res) {
  // Check if user has already submitted a questionnaire
  QuestionnaireUser.where({ userId: req.user.id, questionnaireId: req.params.id })
    .fetch()
    .then((response) => {
      if (response)
        return res.status(404);
    })
    .catch(function (err) {
      console.log(err);
      return res.status(500);
    });

  Questionnaire.where({ id: req.params.id })
    .fetch({ withRelated: ['questions', 'questions.answers'] })
    .then((response) => {
      res.send(response);
    })
    .catch(function (err) {
      console.log(err);
      return res.status(500);
    });
};

/**
 * Get questionnaire by id for admin management
 * GET /questionnaries/5
 */
exports.questionnaireGetByIdAdmin = function (req, res) {

  Questionnaire.where({ id: req.params.id, userId: req.user.id })
    .fetch({ withRelated: ['questions', 'questions.answers', 'questions.answers.answersUsers'] })
    .then((response) => {
      res.send(response);
    })
    .catch(function (err) {
      console.log(err);
      return res.status(500);
    });
};

/**
 * Create new questionnaire from admin panel
 * POST /questionnaire
 */
exports.questionnairePost = function (req, res) {
  req.assert('title', 'Title cannot be blank').notEmpty();
  req.assert('questions', 'Please add at least one question').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  if (req.user.isAdmin === false)
    return res.status(500);

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
                questionId: response.id,
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

/**
 * Edit questionnaire from admin panel
 * POST /questionnaire/edit
 */
exports.questionnaireEditPost = function (req, res) {
  req.assert('title', 'Title cannot be blank').notEmpty();
  req.assert('questions', 'Please add at least one question').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  if (req.user.isAdmin === false)
    return res.status(500);

  // Drop everything and recreate
  knex('questionnaires')
    .innerJoin('questions', 'questionnaires.id', 'questions.questionnaireId')
    .innerJoin('answers', 'answers.questionId', 'questions.id')
    .innerJoin('answersUsers', 'answer.questionnaireId', 'answersUsers.answerId')
    .innerJoin('users', 'users.id', 'questionnaires.userId')
    .where('questionnaires.id', req.body.id)
    .del()
    .then(function (result) {
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
                    questionId: response.id,
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
          res.send({ msg: 'Questionnaire successfully updated.' });

        })
        .catch(function (err) {
          console.log(err);
          return res.status(500);
        });
    })
    .catch(function (err) {
      console.log(err);
      return res.status(500);
    });

};

/**
 * Submit new user filled questionnaire
 * POST /questionnaire/fill
 */
exports.questionnaireFillPost = function (req, res) {
  req.assert('questions', 'Questions cannot be null.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  const questions = req.body.questions;
  questions.map((question) => {

    if (question.questionTypeId === 1) {
      new AnswerUser({
        answerId: question.answers[0].id,
        userId: req.user.id,
        text: question.text
      }).save();
    }

    if (question.questionTypeId === 2 || question.questionTypeId === 3) {
      new AnswerUser({
        answerId: +question.selectedOption,
        userId: req.user.id
      }).save();
    }

    if (question.questionTypeId === 4) {
      question.answers.map((answer) => {

        if (answer.checked) {
          new AnswerUser({
            answerId: answer.id,
            userId: req.user.id
          }).save();
        }
      })
    }

    new QuestionnaireUser({
      userId: req.user.id,
      questionnaireId: questions[0].questionnaireId
    }).save()
      .then((response) => {
        res.send({ msg: 'Thank you for submitting the questionnaire.' });
      })
      .catch(function (err) {
        console.log(err);
        return res.status(500);
      });
  });

};

/**
 * Delete questionnaire cascade
 * DELETE /questionnaire/delete
 */

exports.questionnaireDelete = function (req, res) {

  knex('questionnaires')
    .innerJoin('questions', 'questionnaires.id', 'questions.questionnaireId')
    .innerJoin('answers', 'answers.questionId', 'questions.id')
    .innerJoin('answersUsers', 'answer.questionnaireId', 'answersUsers.answerId')
    .innerJoin('users', 'users.id', 'questionnaires.userId')
    .where('questionnaires.id', req.params.id)
    .del()
    .then(function (result) {
      res.send({ msg: 'Questionnaire deleted.' });
    })
    .catch(function (err) {
      console.log(err);
      return res.status(500);
    });

};