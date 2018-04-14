import React, { Component } from 'react';
import { connect } from 'react-redux'
import Messages from '../components/Messages';

class Questionnaire extends Component {
    constructor(props) {
        super(props);
        this.renderQuestion = this.renderQuestion.bind(this);

        this.state = { title: '', questions: [], types: ['text', 'Yes/No', 'since choice', 'multiple choice'] }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.dispatch(submitQuestionnaireAddForm(this.state.title, this.state.questions));
    }

    onQuestionAdded() {
        var questions = this.state.questions.slice();
        questions.push({ id: 'questionTitle' + questions.length, title: '', type: '', answers: [{ id: 'answersTitle0', title: ''}] });
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
        questions.find(x => x.id === event.target.id).type = event.target.value;
        this.setState({ questions });
    }

    // Add answer for question based on index
    onAnswerAdded(i) {
        var questions = this.state.questions[i].answers.slice();
        questions[i].answers.push({ id: 'answerTitle' + questions[i].answers.length, title: '' });
        this.setState({ questions });
    }

    // Change answer title
    onAnswerChanged(event, question) {
        var questions = this.state.questions.slice();
        const i = questions.indexOf(questions.find(x=> x.id === question.id));
        questions[i].answers.find(x => x.id === event.target.id).title = event.target.value;

        const len = questions[i].answers.length - 1;
        if(questions[i].answers[len].title !== '')
            questions[i].answers.push({ id: 'answerTitle' + questions[i].answers.length, title: '' });
        if(questions[i].answers[len].title === '' && questions[i].answers[len-1] !== undefined && questions[i].answers[len-1].title === '')
            questions[i].answers.pop();
            
        this.setState({ questions });
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
                        <select name={question.id} id={question.id} className="form-control" value={question.type} onChange={(e) => this.onQuestionTypeChange(e)} >
                            <option value="text">Text</option>
                            <option value="Yes/No">Yes/No</option>
                            <option value="single choice">Single choice</option>
                            <option value="multiple choice">Multiple choice</option>
                        </select>
                    </div>
                </div>
                {/* Depending on question type either display nothing if text option is selected, or answer columns if other options are selected */}
                {question.type === 'Yes/No' ? this.renderTrueFalse() : question.type === 'single choice' ||
                    question.type === 'multiple choice' ? question.answers.map((currElement, index) => this.renderSingleOrMultipleChoice(question, index)) : <div></div>}
            </div>
        );
    }

    renderTrueFalse() {
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="true" className="col-sm-2">Answer 1</label>
                    <div className="col-sm-7 col-sm-offset-1">
                        <input type="text" name="true" id="true" className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="false" className="col-sm-2">Answer 2</label>
                    <div className="col-sm-7 col-sm-offset-1">
                        <input type="text" name="false" id="false" className="form-control" />
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
                    <label htmlFor="true" className="col-sm-2">Answer {i+1}</label>
                    <div className="col-sm-7 col-sm-offset-1">
                        <input type="text" name={answer.id} id={answer.id} value={answer.title} onChange={(e) => this.onAnswerChanged(e, question)} className="form-control" />
                    </div>
                </div>
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
                        <Messages messages={this.props.messages} />
                        <form onSubmit={(e) => this.handleSubmit(e)} className="form-horizontal">
                            <div className="form-group">
                                <label htmlFor="title" className="col-sm-2">Questionnaire Title</label>
                                <div className="col-sm-8">
                                    <input type="text" name="title" id="title" className="form-control" value={this.state.title} onChange={(e) => this.handleChange(e)} autoFocus />
                                </div>
                            </div>
                            <br />
                            <br />

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
                                    <button type="submit" className="btn btn-success">Save</button>
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
        messages: state.messages
    };
};

export default connect(mapStateToProps)(Questionnaire);
