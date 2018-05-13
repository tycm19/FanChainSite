import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { SignUpLink } from './SignupPage';
import { auth } from '../firebase';
import loginImg from './images/profile.png';

//Credit for login and signup design due to: Robin Wieruch for an amazing tutorial

const LoginPage = ({ history }) =>
    <div className = "loginMain">
        <h3 className = "loginHeader">FanChain</h3>
        <img className="loginImg" src={loginImg} alt={loginImg} />
        <LoginForm history={history} />
        <SignUpLink />
    </div>

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});


class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: null
        };
    }

    onSubmit = (event) => {
        const { email, password } = this.state;    
        const { history } = this.props;

        auth.doSignInWithEmailAndPassword(email, password)
            .then((user) => { 
                this.setState(() => ({
                    email: '',
                    password: '',
                    error: null             
                }));
                history.push('./play')
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();
    }

    render() {
        const {
            email,
            password,
            error,
        } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <div className = "formItem">
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
                    className="textInput"
                    value={password}
                    onChange={event => this.setState(byPropKey('password', event.target.value))}
                    type="password"
                    placeholder=" Password"
                    />
                </div>
                <div className="formItem">
                <button className = "formButton" disabled={isInvalid} type="submit">
                    Sign In
                </button>   
                </div>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

export default withRouter(LoginPage);

export {
    LoginForm,
};