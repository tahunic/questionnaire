import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { signup } from '../../actions/auth';
import Messages from '../../components/Messages';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = { firstName: '', lastName: '', email: '', password: '' };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSignup(event) {
    event.preventDefault();
    this.props.dispatch(signup(this.state.firstName, this.state.lastName, this.state.email, this.state.password));
  }

  render() {
    return (
      <div className="login-container container">
        <div className="panel">
          <div className="panel-body">
            <Messages messages={this.props.messages}/>
            <form onSubmit={this.handleSignup.bind(this)}>
              <legend>Create an account</legend>
              <div className="form-group">
                <label htmlFor="firstName">First name</label>
                <input type="text" name="firstName" id="firstName" placeholder="First name" autoFocus className="form-control" value={this.state.firstName} onChange={this.handleChange.bind(this)}/>
              </div>
              <div className="form-group">
                <label htmlFor="name">Last name</label>
                <input type="text" name="lastName" id="lastName" placeholder="Last name" className="form-control" value={this.state.lastName} onChange={this.handleChange.bind(this)}/>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Email" className="form-control" value={this.state.email} onChange={this.handleChange.bind(this)}/>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder="Password" className="form-control" value={this.state.password} onChange={this.handleChange.bind(this)}/>
              </div>
              <button type="submit" className="btn btn-success">Create an account</button>
            </form>
            <div className="hr-title"><span>or</span></div>
            <div className="btn-toolbar text-center">
            </div>
          </div>
        </div>
        <p className="text-center">
          Already have an account? <Link to="/login"><strong>Log in</strong></Link>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Signup);
