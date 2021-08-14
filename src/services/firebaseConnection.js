import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';


var firebaseConfig = {
  apiKey: "AIzaSyC1UK8tEhE1H1U9AapnmalP8siIj39XQwQ",
  authDomain: "oficina-sistema-b2c90.firebaseapp.com",
  projectId: "oficina-sistema-b2c90",
  storageBucket: "oficina-sistema-b2c90.appspot.com",
  messagingSenderId: "1052117405571",
  appId: "1:1052117405571:web:9a62d1c5a0b3bc819bf0b6",
  measurementId: "G-6DD61MR7KC"
};


// Verificando se há conexão aberta
if ( !firebase.apps.length ) {
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
}
  export default firebase;
 