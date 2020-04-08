import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyD_wNQtdLbu5niiW6LUe5_dV1kyHEzKcT8",
    authDomain: "anon30.firebaseapp.com",
    databaseURL: "https://anon30.firebaseio.com",
    projectId: "anon30",
    storageBucket: "anon30.appspot.com",
    messagingSenderId: "55903387198",
    appId: "1:55903387198:web:ef3b9a82f54df3a2839b6f",
    measurementId: "G-4XVDVNX6D6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  

  export default firebase