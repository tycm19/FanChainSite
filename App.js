import React, { Component } from 'react';
//import { Button, Bootstrap, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
//import AddressInput from './Components/AddressInput';
//import $ from 'jquery';
//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';
// './App.css';
import Header from './Components/Header';
//import DisplayStats from './Components/DisplayStats';
import Main from './Components/Main'

//npm install react, jquery, bootstrap-react, react-router

class App extends Component {
   
    render() {
        return (
            <div className="App">
                <h1> FanChain</h1>  
                <Header/>
                <Main/>             
            </div>
        );
    }
}

//Get from API stats (oracalize call on x players/7 stats), parse stats (json parsing)

export default App;
