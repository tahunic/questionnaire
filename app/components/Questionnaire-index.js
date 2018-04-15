import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fetchQuestionnaire, submitQuestionnaireFillForm } from '../actions/questionnaire';
import Messages from '../components/Messages';

const initialState = { questions: [] };

class Questionnaire extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentWillMount() {
        this.props.fetchQuestionnaire(this.props.params.id, this.props.token).then(() => this.setState({questions: this.props.questionnaire.questions}));
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
        console.log(this.state);
    }

    // Change state when changing radio values
    handleOptionChange(event, question) {
        this.props.questionnaire.questions.find(x=>x.id === question.id).selectedOption = +event.target.value;
        this.setState({ questions: this.props.questionnaire.questions });
    }

    // Change state when changing checkbox values
    handleCheckboxChange(event, question) {
        // Find answer in questions array
        var answer = this.props.questionnaire.questions.find(x=>x.id === question.id).answers.find(y=>y.id === +event.target.id);
        answer.checked = !answer.checked;
        this.setState({ questions: this.props.questionnaire.questions });
        console.log(this.state);
    }

    handleTextChange(event, question) {
        this.props.questionnaire.questions.find(x=>x.id === question.id).text = event.target.value;
        this.setState({ questions: this.props.questionnaire.questions });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.submitQuestionnaireFillForm(this.state.questions, this.props.user.id, this.props.token);
        // this.setState(initialState);   
    }

    renderAnswers(question) {
        return question.answers.map((answer) => {
            // Radio buttons            
            if (question.questionTypeId === 2 || question.questionTypeId === 3)
                return (
                    <div key={answer.id} className="form-group">
                        <div className="col-sm-10">
                            <label htmlFor={question.id} className="col-xs-11">{answer.title}</label>
                            <input type="radio" name={question.id} id={question.id} value={answer.id} checked={+question.selectedOption === answer.id} onChange={(e) => this.handleOptionChange(e, question)} className="col-xs-1" />
                        </div>
                    </div>
                );
            // Checkboxes
            if (question.questionTypeId === 4)
                return (
                    <div key={answer.id} className="form-group">
                        <div className="col-sm-10">
                            <label htmlFor={answer.id} className="col-xs-11">{answer.title}</label>
                            <input type="checkbox" name={answer.id} id={answer.id} checked={answer.checked} onChange={(e) => this.handleCheckboxChange(e, question)} className="col-xs-1" />
                        </div>
                    </div>
                );
        });
    }

    renderTextArea(question) {
        // Show textarea if question is type of text
        return (
            <div key={question.id} className="form-group">
                <div className="col-xs-10">
                    <textarea name={question.id} id={question.id} value={question.text} onChange={(e) => this.handleTextChange(e, question)}  className="form-control" />
                </div>
            </div>
        );
    }

    renderQuestions() {
        return this.props.questionnaire.questions.map((question) => {
            return (
                <div key={question.id}>
                    <div className="form-group">
                        <label htmlFor="true" className="col-sm-10">{question.title}</label>
                    </div>
                    <div className="answer-input">
                        {question.questionTypeId === 1 ? this.renderTextArea(question) : this.renderAnswers(question)}
                    </div>
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
                        <Messages messages={this.props.messages} />
                        <form onSubmit={(e) => this.handleSubmit(e)} className="form-horizontal">
                            {this.renderQuestions()}

                            <hr />
                            <div className="form-group">
                                <div className="col-sm-8">
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
        token: state.auth.token,
        questionnaire: state.questionnaires.questionnaire,
        questionTypes: state.questionnaires.questionTypes,
        messages: state.messages,
        user: state.auth.user
    };
};

export default connect(mapStateToProps, { fetchQuestionnaire, submitQuestionnaireFillForm })(Questionnaire);
