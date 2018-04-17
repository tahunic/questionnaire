import fetch from 'isomorphic-fetch';

export function submitQuestionnaireAddForm(title, description, questions, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/questionnaire', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: title,
        description: description,
        questions: questions,
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTIONNAIRE_ADD_SUCCESS',
            messages: [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTIONNAIRE_ADD_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    })
  };
}

export function submitQuestionnaireFillForm(questions, userId, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/questionnaire/fill', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        questions: questions,
        userId: userId
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTIONNAIRE_FILL_SUCCESS',
            payload: [json]
          });
        });
      }
      else {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTIONNAIRE_FILL_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    })
  };
}

export function fetchQuestionTypes() {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/questiontype').then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTION_TYPES_SUCCESS',
            payload: json
          });
        });
      }
    });
  }
}

export function fetchQuestionnaires(token, user) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/questionnaire', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          console.log("fetchQuestionnaires",json);
          // Check if user has already submitted questionnaire and mark it
          json = Array.isArray(json) ? json : [json]
          json.map((questionnaire) => {
            questionnaire.questionnaireUsers.map((questionnaireUser) => {
              if (questionnaireUser.userId === user.id)
                questionnaire.userVoted = true;
            });
          })
          dispatch({
            type: 'QUESTIONNAIRES_SUCCESS',
            payload: json
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTIONNAIRES_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  }
}

export function fetchQuestionnairesAdmin(token, user) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/questionnaire/admin', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTIONNAIRES_ADMIN_SUCCESS',
            payload: json
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTIONNAIRES_ADMIN_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  }
}

export function fetchQuestionnaire(id, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/questionnaire/' + id, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTIONNAIRE_SUCCESS',
            payload: json
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTIONNAIRE_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  }
}

export function fetchQuestionnaireManage(id, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/questionnaire/' + id + '/manage', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTIONNAIRE_MANAGE_SUCCESS',
            payload: json
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTIONNAIRE_MANAGE_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  }
}

export function deleteQuestionnaire(id, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/questionnaire/' + id, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTIONNAIRE_DELETE_SUCCESS',
            payload: json
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTIONNAIRE_DELETE_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  }
}