export default function messages(state = {}, action) {
  switch (action.type) {
    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
    case 'CONTACT_FORM_FAILURE':
    case 'QUESTIONNAIRES_FAILURE':
    case 'QUESTIONNAIRES_ADMIN_FAILURE':
    case 'QUESTIONNAIRE_MANAGE_SUCCESS':
    case 'QUESTIONNAIRE_DELETE_FAILURE':
    case 'QUESTIONNAIRE_FAILURE':
    case 'QUESTIONNAIRE_ADD_FAILURE':
    case 'QUESTIONNAIRE_EDIT_FAILURE':
    case 'QUESTIONNAIRE_FILL_FAILURE':
    case 'QUESTIONNAIRE_FILL_FAILURE':
    case 'UNLINK_FAILURE':
    case 'LINK_FAILURE':
      return {
        error: action.messages
      };
    case 'CONTACT_FORM_SUCCESS':
      return {
        success: action.messages
      };
    case 'QUESTIONNAIRE_ADD_SUCCESS':
      return {
        success: action.messages
      };
    case 'QUESTIONNAIRE_EDIT_SUCCESS':
      return {
        success: action.messages
      };
    case 'QUESTIONNAIRES_SUCCESS':
      return {
        success: action.messages
      };
    case 'QUESTIONNAIRES_ADMIN_SUCCESS':
      return {
        success: action.messages
      };
    case 'QUESTIONNAIRE_MANAGE_FAILURE':
      return {
        success: action.messages
      };
    case 'QUESTIONNAIRE_DELETE_FAILURE':
      return {
        success: action.messages
      };
    case 'QUESTIONNAIRE_FILL_SUCCESS':
      return {
        success: action.messages
      };
    case 'UNLINK_SUCCESS':
      return {
        info: action.messages
      };
    case 'CLEAR_MESSAGES':
      return {};
    default:
      return state;
  }
}
