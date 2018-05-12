import React from 'react';
import { auth } from '../firebase';

const Signout = () =>
    <button className = "signout" type="button" onClick={auth.doSignOut}>
        Sign Out
    </button>

export default Signout;