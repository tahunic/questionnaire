export function submitQuestionnaireAddForm(title, questions) {
    return (dispatch) => {
      dispatch({
        type: 'CLEAR_MESSAGES'
      });
      return fetch('/questionnaire', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          questions: questions,
        })
      }).then((response) => {
        if (response.ok) {
          return response.json().then((json) => {
            dispatch({
              type: 'CONTACT_FORM_SUCCESS',
              messages: [json]
            });
          });
        } else {
          return response.json().then((json) => {
            dispatch({
              type: 'CONTACT_FORM_FAILURE',
              messages: Array.isArray(json) ? json : [json]
            });
          });
        }
      });
    };
  }
  