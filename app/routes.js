import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Login from './components/Account/Login';
import Signup from './components/Account/Signup';
import QuestionnaireAdd from './components/Questionnaire-add';
import QuestionnaireList from './components/Questionnaire-list';
import QuestionnaireIndex from './components/Questionnaire-index';

export default function getRoutes(store) {
  const ensureAuthenticated = (nextState, replace) => {
    if (!store.getState().auth.token) {
      replace('/login');
    }
  };
  const skipIfAuthenticated = (nextState, replace) => {
    if (store.getState().auth.token) {
      replace('/');
    }
  };
  const clearMessages = () => {
    store.dispatch({
      type: 'CLEAR_MESSAGES'
    });
  };
  return (
    <Route path="/" component={App}>
      <IndexRoute component={QuestionnaireList} onLeave={clearMessages}/>
      <Route path="/management" component={QuestionnaireList} onLeave={clearMessages}/>
      <Route path="/questionnaire-add" component={QuestionnaireAdd} onLeave={clearMessages}/>
      <Route path="/questionnaires/:id" component={QuestionnaireList} onLeave={clearMessages}/>
      <Route path="/contact" component={Contact} onLeave={clearMessages}/>
      <Route path="/login" component={Login} onEnter={skipIfAuthenticated} onLeave={clearMessages}/>
      <Route path="/signup" component={Signup} onEnter={skipIfAuthenticated} onLeave={clearMessages}/>
      <Route path="*" component={NotFound} onLeave={clearMessages}/>
    </Route>
  );
}
