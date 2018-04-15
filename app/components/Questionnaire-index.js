import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fetchQuestionnaire, fetchQuestionTypes } from '../actions/questionnaire';
import Messages from '../components/Messages';

const initialState = { title: '', description: '', questions: [], types: [] };

class Questionnaire extends Component {
    constructor(props) {
        super(props);
        this.renderQuestion = this.renderQuestion.bind(this);
        this.state = initialState;
    }

    componentWillMount() {
        const types = [{ id: 1, name: 'Text' }, { id: 2, name: 'Yes/No' }, { id: 3, name: 'Single choice' }, { id: 4, name: 'Multiple choice' }]

        this.props.fetchQuestionnaire(this.props.params.id, this.props.token).then((res) => console.log(res));
        this.props.fetchQuestionTypes();
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.filterAnswers();
        this.props.dispatch(submitQuestionnaireAddForm(this.state.title, this.state.description, this.state.questions, this.props.token));
        this.setState({ title: initialState.title, description: initialState.description, questions: initialState.questions });
    }

    onQuestionAdded() {
        var questions = this.state.questions.slice();
        questions.push({ id: 'questionTitle' + questions.length, title: '', questionTypeId: 1, answers: [{ id: 'answersTitle0', title: '' }] });
        this.setState({ questions });
    }

    onQuestionChange(event) {
        var questions = this.state.questions.slice();
        questions.find(x => x.id === event.target.id).title = event.target.value;
        this.setState({ questions });
    }

    // Change question type
    onQuestionTypeChange(event) {
        var questions = this.state.questions.slice();
        var question = questions.find(x => x.id === event.target.id);
        question.questionTypeId = +event.target.value;
        if (question.questionTypeId === 2)
            this.pushNewTrueFalseAnswers(question);
        this.setState({ questions });
    }

    // Add answer for question based on index
    onAnswerAdded(i) {
        var questions = this.state.questions[i].answers.slice();
        questions[i].answers.push({ id: 'answerTitle' + questions[i].answers.length, title: '' });
        this.setState({ questions });
    }

    // Change answer title and expand list if single multiple choice is selected 
    onAnswerChanged(event, question) {
        var questions = this.state.questions.slice();
        const i = questions.indexOf(questions.find(x => x.id === question.id));
        questions[i].answers.find(x => x.id === event.target.id).title = event.target.value;

        const len = questions[i].answers.length - 1;
        if (questions[i].answers[len].title !== '' && len <= 8)
            questions[i].answers.push({ id: 'answerTitle' + questions[i].answers.length, title: '' });
        if (questions[i].answers[len].title === '' && questions[i].answers[len - 1] !== undefined && questions[i].answers[len - 1].title === '')
            questions[i].answers.pop();

        this.setState({ questions });
    }

    filterAnswers() {
        this.state.questions.map((q) => (q.answers[q.answers.length - 1].title === '') ? q.answers.pop() : null);
    }

    // Add answers to state for true/false option
    pushNewTrueFalseAnswers(question) {
        var questions = this.state.questions.slice();
        questions.find(x => x.id === question.id).answers.push({ id: 'answersTitle1', title: '' });
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

    renderTrueFalse(question) {
        const answer = question.answers;
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="true" className="col-sm-2">Answer 1</label>
                    <div className="col-sm-7 col-sm-offset-1">
                        <input type="text" name="answersTitle0" id="answersTitle0" value={answer[0].title} onChange={(e) => this.onAnswerChanged(e, question)} className="form-control" />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="false" className="col-sm-2">Answer 2</label>
                    <div className="col-sm-7 col-sm-offset-1">
                        <input type="text" name="answersTitle1" id="answersTitle1" value={answer[1].title} onChange={(e) => this.onAnswerChanged(e, question)} className="form-control" />
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

    renderQuestion(question) {

        return (
            <div key={question.id}>
                <div className="form-group">
                    <label htmlFor="true" className="col-sm-10">{question.title}</label>
                </div>
                <div className="form-group">
                    <div className="col-sm-10">
                        <label htmlFor="true" className="col-sm-2">Answer {i + 1}</label>
                        <input type="radio" className="form-control" /> {question.answers[0].title}
                        <input type="radio" className="form-control" /> {question.answers[1].title}
                    </div>
                </div>
            </div>
        );
    }

    renderAnswers(question) {
        console.log(question);
        return question.answers.map((answer) => {
            return (
                <div key={answer.id} className="form-group">
                    <div className="col-sm-10">
                        <label htmlFor="true" className="col-sm-8 col-xs-8">{answer.title}</label>
                        <input type="radio" className="col-sm-2 col-xs-2" />
                    </div>
                </div>
            );
        });
    }

    renderQuestions() {

        return this.props.questionnaire.questions.map((question) => {
            return (
                <div key={question.id}>
                    <div className="form-group">
                        <label htmlFor="true" className="col-sm-10">{question.title}</label>
                    </div>

                    {this.renderAnswers(question)}
                </div>
            );
        });
    }

    render() {
        const { questionnaire } = this.props;
        if (!questionnaire) {
            return <div>Loading...</div>
        }
        return (
            <div className="container">
                <div className="panel">
                    <div className="panel-heading">
                        <h3 className="panel-title">{questionnaire.title}</h3>
                    </div>

                    <div className="panel-heading">
                        <h3 className="panel-title">{questionnaire.description}</h3>
                    </div>
                    <div className="panel-body">
                        {this.renderQuestions()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        questionnaire: state.questionnaires.questionnaire,
        questionTypes: state.questionnaires.questionTypes,
        messages: state.messages
    };
};

export default connect(mapStateToProps, { fetchQuestionnaire, fetchQuestionTypes })(Questionnaire);
