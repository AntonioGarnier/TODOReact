import firebase from 'firebase'


const config = {
    apiKey: 'AIzaSyBcONlIpwNalvf1uVSXL_dBGg6NA43C_iI',
    authDomain: 'todolist-84dec.firebaseapp.com',
    databaseURL: 'https://todolist-84dec.firebaseio.com',
    projectId: 'todolist-84dec',
    storageBucket: 'todolist-84dec.appspot.com',
    messagingSenderId: '816657445335',
}

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default firebase
