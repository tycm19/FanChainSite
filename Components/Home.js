import React, { Component } from 'react';
import logo from '../images/logoFC.png';

class Home extends Component {    

    render() {
        return (

            <div className="Home">

                <h3 className="headingHome"> <img className="logoImg" src={logo} alt={logo} /> FanChain </h3>
                <p>
                Welcome to FanChain, a safe and trustless way to play fantasy hockey. Secure deposits, scoring,
                and player selections on the Ethereum blockchain through usage of smart contracts. Players are guaranteed their 
                winnings through autonomous scoring that utilize oracles to receive reliable NHL stats.
                </p>
            </div>
        );
    }
}

export default Home;