export default function messages(state = {}, action) {
  switch (action.type) {
    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
    case 'CONTACT_FORM_FAILURE':
    case 'UNLINK_FAILURE':
    case 'LINK_FAILURE':
      return {
        error: action.messages
      };
    case 'CONTACT_FORM_SUCCESS':
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
