import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { auth } from '../firebase';
import signup from './images/signup.png';

const SignupPage = ({ history }) =>
    <div className = "loginMain">
        <h3 className = "loginHeader">Sign Up</h3>
        <img className="signupImg" src={signup} alt={signup} />
        <SignUpForm history={history} />
    </div>

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            passwordOne: '',
            passwordTwo: '',
            error: null, };
    }

    onSubmit = (event) => {
        const {
            username,
            email,
            passwordOne,
        } = this.state;

        const {
            history
        } = this.props;

        auth.doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                this.setState(() => ({
                    username: '',
                    email: '',
                    passwordOne: '',
                    passwordTwo: '',
                    error: null, }));
                history.push('./loginpage')
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();
    }

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        return (
            <form onSubmit={this.onSubmit}>

                <div className="formItem">
                <input
                    className = "textInput"
                    value={username}
                    onChange={event => this.setState(byPropKey('username', event.target.value))}
                    type="text"
                    placeholder=" Full Name"
                />
                </div>
                <div className="formItem">
                <input
                    className = "textInput"
                    value={email}
                    onChange={event => this.setState(byPropKey('email', event.target.value))}
                    type="text"
                    placeholder=" Email Address"
                />
                </div>
                <div className="formItem">
                <input
                    className = "textInput"
                    value={passwordOne}
                    onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                    type="password"
                    placeholder=" Password"
                />
                </div>
                <div className="formItem">
                <input
                    className = "textInput"
                    value={passwordTwo}
                    onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                    type="password"
                    placeholder=" Confirm Password"
                />
                </div>
                <div className="formItem">
                <button className ="formButton" type="submit">
                    Sign Up
                </button>
                </div>
                {error && <p>{error.message}</p>}

            </form>
        );
    }
}

const SignUpLink = () =>
    <p>
        Need an account?
    {' '}
        <Link to={'/signup'}>Sign Up</Link>
    </p>

export default withRouter(SignupPage);

export {
    SignUpForm,
    SignUpLink,
};