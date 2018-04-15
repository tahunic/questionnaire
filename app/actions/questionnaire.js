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
            messages: json
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'QUESTION_TYPES_FAILURE',
            messages: json
          });
        });
      }
    });
  }
}

export function fetchQuestionnaires(token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    try {
      return fetch('/questionnaire', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then((response) => {
        if (response.ok) {
          return response.json().then((json) => {
            dispatch({
              type: 'QUESTIONNAIRES_SUCCESS',
              payload: json
            });
            console.log("Resoinse", json)
          });
        }
      });
    }
    catch (error) {
      console.log(error);
    }
  }
}

export function fetchQuestionnaire(id, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    try {
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
            console.log("Resoinse", json)
          });
        }
      });
    }
    catch (error) {
      console.log(error);
    }
  }
}