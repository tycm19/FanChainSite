import React from 'react';
import { auth } from '../firebase';

const Signout = () =>
    <button className = "signout" type="button" onClick={auth.doSignOut}>
        Log Out
    </button>

export default Signout;