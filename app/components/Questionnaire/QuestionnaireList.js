import React, { Component } from 'react';
import { connect } from 'react-redux'
import Messages from '../../components/Messages';
import { fetchQuestionnaires, fetchQuestionnairesAdmin } from '../../actions/questionnaire';
import { Link } from 'react-router'; 

class QuestionnaireList extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.fetchQuestionnaires(this.props.token, this.props.user);
    }

    renderQuestionnaires() {
        return this.props.questionnaires.all.map((q) => {
            return (
                <div className="col-sm-4 col-xs-12" key={q.id}>
                    <div className="panel">
                        <div className="panel-body">
                            <h3>{q.title}</h3>
                            <p>{`${q.description.substring(0, 250)}...`}</p>
                            { q.userVoted ? <div role="alert" className="alert alert-success msg-box"><div>You voted on this questionnaire</div></div> : this.props.user.id !== q.userId ? <Link to={'/questionnaires/' + q.id } className="btn btn-primary">Vote</Link> : null }
                            { this.props.user.isAdmin && q.userId === this.props.user.id ? <Link to={`/questionnaires/${q.id}/manage`} className="btn btn-default"><strong>Manage details</strong></Link> : <div></div> }
                        </div>
                    </div>
                </div>
            );
        });
    }

    render() {
        const { questionnaires } = this.props;
        const { messages } = this.props;

        if(!questionnaires.all && messages){
            return <Messages messages={this.props.messages} />;
        }
        if(!questionnaires.all){
            return <div>Loading...</div>;
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
        questionnaires: state.questionnaires,
        user: state.auth.user
    };
};

export default connect(mapStateToProps, { fetchQuestionnaires, fetchQuestionnairesAdmin })(QuestionnaireList);
