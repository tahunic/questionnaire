import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import questionnaires from './questionnaire';

export default combineReducers({
  messages,
  auth,
  questionnaires
});
