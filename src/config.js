import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

export const firebaseConfig = {
  apiKey: "AIzaSyD_wNQtdLbu5niiW6LUe5_dV1kyHEzKcT8",
  authDomain: "anon30.firebaseapp.com",
  databaseURL: "https://anon30.firebaseio.com",
  projectId: "anon30",
  storageBucket: "anon30.appspot.com",
  messagingSenderId: "55903387198",
  appId: "1:55903387198:web:ef3b9a82f54df3a2839b6f",
  measurementId: "G-4XVDVNX6D6"
}

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export const reduxFirebase = {
  userProfile: 'users',
  useFirestoreForProfile: true,
  enableLogging: true
}

export const db=firebase.firestore()

export default { firebaseConfig, reduxFirebase,db }
