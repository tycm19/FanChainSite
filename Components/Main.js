import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import DisplayStats from './DisplayStats';
import Competition from './Competition';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

const Main = props => (
    <main>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/play' component={DisplayStats} />
            <Route path='/competition' component={Competition} />
            <Route path='/loginpage' component={LoginPage} />
            <Route path='/signup' component={SignupPage} />
        </Switch>
    </main>
)

export default Main
