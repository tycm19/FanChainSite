import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyD3tIAIcUEGEAtsFJhY1As3qIK7zM9J7ts",
    authDomain: "fanchain-auth.firebaseapp.com",
    databaseURL: "https://fanchain-auth.firebaseio.com",
    projectId: "fanchain-auth",
    storageBucket: "fanchain-auth.appspot.com",
    messagingSenderId: "325434217034"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const auth = firebase.auth();

export {
    auth,
};