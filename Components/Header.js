import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => (
    <header>
        <nav>
            <ul>                
                <li className="home"><Link to='/'>Home</Link></li>
                <li className="play"><Link to='/play'>Play</Link></li>
                <li className="about"><Link to='/about'>About</Link></li>
            </ul>
        </nav>
    </header>
)

export default Header
