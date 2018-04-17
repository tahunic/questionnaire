import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fetchQuestionnaireManage, deleteQuestionnaire } from '../../actions/questionnaire';
import Messages from '../../components/Messages';
import { Link } from 'react-router';
import { Line, Circle } from 'rc-progress';
import Confirm from 'react-confirm-bootstrap';
import { browserHistory } from 'react-router';

const initialState = { questions: [], messages: [] };

class Questionnaire extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentWillMount() {
        this.props.fetchQuestionnaireManage(this.props.params.id, this.props.token).then(() => this.setState({ questions: this.props.questionnaire.questions }));
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    percentage(votes, totalVotes) {
        if (totalVotes === 0)
            return 0;
        return (votes / totalVotes) * 100;
    }

    onConfirmDelete() {
        this.props.deleteQuestionnaire(this.props.params.id, this.props.token).then((res) => {
            browserHistory.push('/');
        });
    }

    renderAnswers(question) {
        var totalVotes = 0;
        question.answers.map((answer) => totalVotes += answer.answersUsers.length)
        return question.answers.map((answer) => {

            if (question.questionTypeId === 1)
                return (
                    <div key={answer.id} className="form-group">
                        <div className="col-sm-12">
                            {answer.answersUsers.map((answerUser, index) => <div> <p>{index + 1}. {answerUser.text}</p> </div>)}
                        </div>
                    </div>
                );
            else
                return (
                    <div key={answer.id} className="form-group">
                        <div className="col-sm-12">
                            <label htmlFor={question.id} className="col-xs-12 col-sm-6">{answer.title} ({answer.answersUsers.length})</label>
                            <div className="col-xs-12 col-sm-6">
                                <div>
                                    <Line percent={this.percentage(answer.answersUsers.length, totalVotes)} strokeWidth="4" strokeColor="#2db7f5" trailColor="#D9D9D9" />
                                </div>
                            </div>
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
                        <label htmlFor="true" className="col-sm-12">{question.title}</label>
                    </div>
                    <div className="answer-input">
                        {this.renderAnswers(question)}
                    </div>
                </div>
            );
        });
    }

    render() {
        const { questionnaire } = this.props;

        if (!questionnaire && this.state.message) {
            return (
                <div>
                    <div className="container">
                        <div role="alert" className="alert alert-success">
                            <div>{this.state.message}</div>
                        </div>
                        <Link to={'/'} className="btn btn-default">Return to questionnaires</Link>
                    </div>
                </div>
            );
        }

        if (!questionnaire) {
            return <div>Loading...</div>
        }

        return (
            <div className="container">
                <Link to={'/'} className="btn btn-default back-btn">Return to questionnaries</Link>
                <div className="panel">
                    <div className="panel-heading">
                        <h2 className="panel-title">{questionnaire.title}</h2>
                    </div>

                    <div className="panel-heading">
                        <h3 className="panel-title questionnaire-index-desc">{questionnaire.description}</h3>
                    </div>
                    <div className="panel-body">
                        <form onSubmit={(e) => this.handleSubmit(e)} className="form-horizontal">
                            {this.renderQuestions()}

                            <hr />
                            <div className="form-group">
                                <div className="col-sm-8">
                                    <Link to={'/management/' + this.props.questionnaire.id} className="btn btn-primary">Edit questionnaire</Link>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="col-sm-8">
                                    <Confirm onConfirm={() => this.onConfirmDelete()} body="Are you sure you want to delete questionnaire?" confirmText="Confirm Delete" title="Delete questionnaire">
                                        <button type="button" className="btn btn-danger">Delete questionnaire</button>
                                    </Confirm>
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
        messages: state.messages,
        user: state.auth.user
    };
};

export default connect(mapStateToProps, { fetchQuestionnaireManage, deleteQuestionnaire })(Questionnaire);
