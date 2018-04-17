import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Login from './components/Account/Login';
import Signup from './components/Account/Signup';
import QuestionnaireAdd from './components/Questionnaire/QuestionnaireAdd';
import QuestionnaireList from './components/Questionnaire//QuestionnaireList';
import QuestionnaireIndex from './components/Questionnaire//QuestionnaireIndex';
import QuestionnaireManage from './components/Questionnaire//QuestionnaireManage';

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
  const loginIfNotAuthenticated = (nextState, replace) => {
    if (!store.getState().auth.token) {
      replace('/login');
    }
  };
  const redirectIfNotAuthorized = (nextState, replace) => {
    if (store.getState().auth.user.isAdmin !== true) {
      replace('/not-found');
    }
  };
  const clearMessages = () => {
    store.dispatch({
      type: 'CLEAR_MESSAGES'
    });
  };
  return (
    <Route path="/" component={App}>
      <IndexRoute component={QuestionnaireList} onEnter={loginIfNotAuthenticated} onLeave={clearMessages}/>
      <Route path="/management" component={QuestionnaireAdd} onLeave={clearMessages}/>
      <Route path="/management/:id" component={QuestionnaireAdd} onLeave={clearMessages}/>
      <Route path="/questionnaires/:id" component={QuestionnaireIndex} onLeave={clearMessages}/>
      <Route path="/questionnaires/:id/manage" component={QuestionnaireManage} onLeave={clearMessages}/>
      <Route path="/contact" component={Contact} onLeave={clearMessages}/>
      <Route path="/login" component={Login} onEnter={skipIfAuthenticated} onLeave={clearMessages}/>
      <Route path="/signup" component={Signup} onEnter={skipIfAuthenticated} onLeave={clearMessages}/>
      <Route path="/not-found" component={NotFound} onLeave={clearMessages}/>
      <Route path="*" component={NotFound} onLeave={clearMessages}/>
    </Route>
  );
}
