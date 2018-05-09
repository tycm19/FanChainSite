import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import DisplayStats from './DisplayStats';
import Competition from './Competition';

const Main = props => (
    <main>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/play' component={DisplayStats} />
            <Route path='/competition' component={Competition} />
        </Switch>
    </main>
)

export default Main
