import React, { Component } from 'react';
import { connect } from 'react-redux'
import Messages from '../components/Messages';
import { fetchQuestionnaires } from '../actions/questionnaire';
import { Link } from 'react-router'; 

class QuestionnaireList extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (this.props.location.pathname === '/management') {
            this.props.fetchQuestionnaires(this.props.token);
        }
        else {
            this.props.fetchQuestionnaires(this.props.token);
        }
    }

    renderQuestionnaires() {
        return this.props.questionnaires.all.map((q) => {
            return (
                <div className="col-sm-4" key={q.id}>
                    <div className="panel">
                        <div className="panel-body">
                            <h3>{q.title}</h3>
                            <p>{q.description}</p>
                            <Link to={'/questionnaires/' + q.id } className="btn btn-default">View details</Link>
                            <a href="#" role="button" className="btn btn-default">Edit</a>
                        </div>
                    </div>
                </div>
            );
        });
    }

    render() {
        const { questionnaires } = this.props;

        if(!questionnaires.all){
            return <div>Loading...</div>
        }
        return (
            <div className="container-fluid">
                <Messages messages={this.props.messages} />
                <div className="row">
                    {this.renderQuestionnaires()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        messages: state.messages,
        questionnaires: state.questionnaires
    };
};

export default connect(mapStateToProps, { fetchQuestionnaires })(QuestionnaireList);
