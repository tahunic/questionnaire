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
                questionId: response.id,
                votes: 0
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

exports.questionnaireFillPost = function (req, res) {
  req.assert('questions', 'Questions cannot be null.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  const questions = req.body.questions;
  questions.map((question) => {

    // Rethink saving texts in database  
    if(question.questionTypeId === 1) {
    //   Question.where({id: +question.selectedOption})
    //   .fetch({ columns: ['textJson'] })
    //   .then((response) => {
    //     Question.where({id: question.id})
    //   .save({text: question.text}, {patch: true})
    //   .then((res) => {
    //     console.log("UPDATE");
    //   })
    //   })
    }
    
    // Check if question type is radio, check if selected and increment total votes
    if(question.questionTypeId === 2 || question.questionTypeId === 3) {
      Answer.where({id: +question.selectedOption})
      .fetch({ columns: ['id', 'votes'] })
      .then((response) => {
        const votes = response.attributes.votes + 1;    
        Answer.where({id: +question.selectedOption})
        .save({ votes: votes}, {patch: true})
      })
    }

    // Check if question type is checkbox, check if selected and increment total votes    
    if(question.questionTypeId === 4) {
      question.answers.map((answer) => {
        console.log(answer);
        
        if(answer.checked){
          Answer.where({ id: answer.id })
            .fetch({ columns: ['id', 'votes']})
            .then((response) => {
              const votes = response.attributes.votes + 1;    
              Answer.where({ id: answer.id })
                .save({ votes: votes }, {patch: true})
            })
        }
      })

    }

    res.send({ msg: 'Thank you for submitting the questionnaire.' });
    
  });

  // new Questionnaire({
  //   title: req.body.title,
  //   description: req.body.description,
  //   userId: req.user.id,
  // }).save()
  //   .then(function (response) {
  //     req.body.questions.map(question => {
  //       new Question({
  //         title: question.title,
  //         questionTypeId: question.questionTypeId,
  //         questionnaireId: response.id
  //       }).save()
  //         .then(function (response) {
  //           question.answers.map(answer => {
  //             new Answer({
  //               title: answer.title,
  //               questionId: response.id
  //             }).save()
  //               .then(function (response) {

  //               })
  //               .catch(function (err) {
  //                 console.log(err);
  //                 return res.status(500);
  //               });
  //           });
  //         })
  //         .catch(function (err) {
  //           console.log(err);
  //           return res.status(500);
  //         });
  //     });
  //     res.send({ msg: 'New questionnaire successfully added.' });

  //   })
  //   .catch(function (err) {
  //     console.log(err);
  //     return res.status(500);
  //   });

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