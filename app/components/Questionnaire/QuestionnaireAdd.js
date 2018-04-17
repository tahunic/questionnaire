import React, { Component } from 'react';
import { connect } from 'react-redux'
import { submitQuestionnaireAddForm, fetchQuestionTypes, fetchQuestionnaire, submitQuestionnaireEditForm } from '../../actions/questionnaire';
import Messages from '../../components/Messages';
import { browserHistory } from 'react-router';
import { smoothScroll } from '../../util/smoothScroll';
import Confirm from 'react-confirm-bootstrap';

const initialState = { title: '', description: '', questions: [], types: [], messages: {} };

class QuestionnaireAdd extends Component {
    constructor(props) {
        super(props);
        this.renderQuestion = this.renderQuestion.bind(this);
        this.state = initialState;
    }

    componentWillMount() {
        if (this.props.user.isAdmin == false)
            browserHistory.push('/not-found');
        this.props.fetchQuestionTypes().then(() => {
            this.setState({ types: this.props.questionTypes })
        })
        if (this.props.params.id) {
            this.props.fetchQuestionnaire(this.props.params.id, this.props.token).then(() => {
                const q = this.props.questionnaire;
                this.setState({ title: q.title, description: q.description, questions: q.questions })
            })
        }
        this.setState({ messages: this.props.messages });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.filterAnswers();
        if (this.validateForm()) {
            this.props.submitQuestionnaireAddForm(this.state.title, this.state.description, this.state.questions, this.props.token).then(() => {
                this.setState({ title: initialState.title, description: initialState.description, questions: initialState.questions, messages: this.props.messages });
            });
        }
    }

    onConfirmEdit() {
        if (this.validateForm()) {
            this.props.submitQuestionnaireEditForm(this.props.params.id, this.state.title, this.state.description, this.state.questions, this.props.token).then(() => {
                this.setState({ title: initialState.title, description: initialState.description, questions: initialState.questions, messages: this.props.messages });
            });
        }
    }

    validateForm() {
        var messages = { error: [] };
        this.state.title === '' ? messages.error.push({ msg: 'Title should not be blank.' }) : null;
        this.state.description === '' ? messages.error.push({ msg: 'Description should not be blank.' }) : null;
        this.state.questions.length === 0 ? messages.error.push({ msg: 'Please add at least one question.' }) : null;
        this.state.questions.map((question, index) => question.title === '' ? messages.error.push({ msg: (index + 1) + '. question title should not be blank.' }) : null)
        this.setState({ messages: messages });
        smoothScroll.scrollTo('top');
        if (messages.error.length === 0)
            return true;
    }

    onQuestionAdded() {
        var questions = this.state.questions.slice();
        questions.push({ id: questions.length, title: '', questionTypeId: 1, answers: [{ id: 0, title: '' }] });
        this.setState({ questions });
    }

    onQuestionChange(event) {
        var questions = this.state.questions.slice();
        questions.find(x => x.id === +event.target.id).title = event.target.value;
        this.setState({ questions });
    }

    // Change question type
    onQuestionTypeChange(event) {
        var questions = this.state.questions.slice();
        var question = questions.find(x => x.id === +event.target.id);
        question.questionTypeId = +event.target.value;
        if (question.questionTypeId === 2)
            this.pushNewTrueFalseAnswers(question);
        this.setState({ questions });
    }

    // Add answer for question based on index
    onAnswerAdded(i) {
        var questions = this.state.questions[i].answers.slice();
        questions[i].answers.push({ id: questions[i].answers.length, title: '' });
        this.setState({ questions });
    }

    // Change answer title and expand list if single multiple choice is selected 
    onAnswerChanged(event, question) {
        var questions = this.state.questions.slice();
        const i = questions.indexOf(questions.find(x => x.id === question.id));
        questions[i].answers.find(x => x.id === +event.target.id).title = event.target.value;

        // Add or remove rows
        const len = questions[i].answers.length - 1;
        if (questions[i].answers[len].title !== '' && len <= 8)
            questions[i].answers.push({ id: questions[i].answers.length, title: '' });
        if (questions[i].answers[len].title === '' && questions[i].answers[len - 1] !== undefined && questions[i].answers[len - 1].title === '')
            questions[i].answers.pop();

        this.setState({ questions });
    }

    // Remove last element for single and multiple choices
    filterAnswers() {
        this.state.questions.map((q) => (q.answers[q.answers.length - 1].title === '' && q.questionTypeId !== 1) ? q.answers.pop() : null);
    }

    // Add answers to state for true/false option
    pushNewTrueFalseAnswers(question) {
        var questions = this.state.questions.slice();
        questions.find(x => x.id === question.id).answers.push({ id: 1, title: '' });
        this.setState({ questions });
    }

    scrollUp() {
        var doc = document.documentElement;
        var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

        if (top > 0) {
            window.scrollTo(0, top - 15)
            setTimeout(this.scrollUp, 10)
        }
    }

    renderTrueFalse(question) {
        const answer = question.answers;
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="true" className="col-sm-2">Answer 1</label>
                    <div className="col-sm-7 col-sm-offset-1">
                        <input type="text" name={answer[0].id} id={answer[0].id} value={answer[0].title} onChange={(e) => this.onAnswerChanged(e, question)} className="form-control" />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="false" className="col-sm-2">Answer 2</label>
                    <div className="col-sm-7 col-sm-offset-1">
                        <input type="text" name={answer[1].id} id={answer[1].id} value={answer[1].title} onChange={(e) => this.onAnswerChanged(e, question)} className="form-control" />
                    </div>
                </div>
            </div>
        );
    }

    renderSingleOrMultipleChoice(question, i) {
        const answer = question.answers[i];
        return (
            <div key={answer.id}>
                <div className="form-group">
                    <label htmlFor="true" className="col-sm-2">Answer {i + 1}</label>
                    <div className="col-sm-7 col-sm-offset-1">
                        <input type="text" name={answer.id} id={answer.id} value={answer.title} onChange={(e) => this.onAnswerChanged(e, question)} className="form-control" />
                    </div>
                </div>
            </div>
        );
    }

    renderQuestion(i) {
        const question = this.state.questions[i];
        return (
            <div className="question-add" key={question.id}>
                <div className="form-group">
                    <label htmlFor="title" className="col-sm-2">Question Title</label>
                    <div className="col-sm-8">
                        <input type="text" name={question.id} id={question.id} className="form-control" value={question.title} onChange={(e) => this.onQuestionChange(e)} autoFocus />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="newQuestion" className="col-sm-2">Question type</label>
                    <div className="col-sm-8">
                        <select name={question.id} id={question.id} className="form-control" value={question.questionTypeId} onChange={(e) => this.onQuestionTypeChange(e)}>
                            {this.state.types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Depending on question type either display nothing if text option is selected, or answer columns if other options are selected */}
                {question.questionTypeId === 2 ? this.renderTrueFalse(question) : question.questionTypeId === 3 ||
                    question.questionTypeId === 4 ? question.answers.map((currElement, index) => this.renderSingleOrMultipleChoice(question, index)) : <div></div>}
            </div>
        );
    }

    render() {
        return (
            <div className="container">
                <div className="panel">
                    <div className="panel-heading">
                        <h3 className="panel-title">New Questionnaire</h3>
                    </div>
                    <div className="panel-body">
                        <Messages messages={this.state.messages} />
                        <form onSubmit={(e) => this.handleSubmit(e)} className="form-horizontal">
                            <div className="form-group">
                                <label htmlFor="title" className="col-sm-2">Questionnaire Title</label>
                                <div className="col-sm-8">
                                    <input type="text" name="title" id="title" className="form-control" value={this.state.title} onChange={(e) => this.handleChange(e)} autoFocus />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description" className="col-sm-2">Questionnaire description</label>
                                <div className="col-sm-8">
                                    <textarea name="description" id="description" rows="5" className="form-control" value={this.state.description} onChange={(e) => this.handleChange(e)} />
                                </div>
                            </div>
                            <br /><br />

                            {this.state.questions.map((currElement, index) => this.renderQuestion(index))}

                            <div className="form-group">
                                <label htmlFor="newQuestion" className="col-sm-2"></label>
                                <div className="col-sm-8">
                                    <button type="button" className="btn btn-primary" onClick={() => this.onQuestionAdded()}>Add new question</button>
                                </div>
                            </div>
                            <hr />
                            <div className="form-group">
                                <div className="col-sm-offset-2 col-sm-8">
                                    {this.props.params.id ? <Confirm onConfirm={() => this.onConfirmEdit()} body="Updating questionnaire will discard all current results. Are you sure?" confirmText="Confirm Edit" title="Edit questionnaire">
                                        <button type="button" className="btn btn-success">Save</button>
                                    </Confirm> : <button type="submit" className="btn btn-success">Save</button>}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        messages: state.messages,
        questionTypes: state.questionnaires.questionTypes,
        user: state.auth.user,
        questionnaire: state.questionnaires.questionnaire
    };
};

export default connect(mapStateToProps, { fetchQuestionTypes, submitQuestionnaireAddForm, fetchQuestionnaire, submitQuestionnaireEditForm })(QuestionnaireAdd);
