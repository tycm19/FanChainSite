import React from 'react'
import { Link } from 'react-router-dom'
import Signout from './Signout'

const Header = ({ authUser }) => 
    <div>
        {authUser
            ? <HeaderAuth />
            : <HeaderNonAuth/>
        }
    </div>

    const HeaderAuth = () =>
        <header>
            <nav>
                <ul>                
                    <li className="home"><Link to='/'>Home</Link></li>
                    <li className="play"><Link to='/play'>Play</Link></li>
                    <li className="competition"><Link to='/competition'>Competition</Link></li>
                    <div className="login"> <Signout /></div>                    
                </ul>
            </nav>
        </header>

    const HeaderNonAuth = () => 
    <header>
        <nav>
            <ul>
                <li className="home"><Link to='/'>Home</Link></li>
                <li className="play"><Link to='/play'>Play</Link></li>
                <li className="competition"><Link to='/competition'>Competition</Link></li>
                <div className = "login"> <button className = "signout"><Link to='/loginpage'>Log In</Link> </button></div>
            </ul>
        </nav>
    </header>

export default Header
