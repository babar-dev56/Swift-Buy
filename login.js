// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase configuration (updated with your provided config)
const firebaseConfig = {
  apiKey: "AIzaSyDuuq-Y2qYqYoWd4smLrvd-b3_7k79g_Ko",
  authDomain: "swiftbuy-70dde.firebaseapp.com",
  projectId: "swiftbuy-70dde",
  storageBucket: "swiftbuy-70dde.firebasestorage.app",
  messagingSenderId: "557105944949",
  appId: "1:557105944949:web:a919b8733df94c510b5b3c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Login form handler
const loginForm = document.querySelector('.login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Get the values from the input fields
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    // Attempt to sign in with Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        
        // Optionally: Retrieve user details from Firestore if needed
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User Data:', userData);
        }

        // Successfully logged in
        alert('Login successful!');
        
        // Store the user id in local storage
        localStorage.setItem('loggedInUserId', user.uid);

        // Redirect to the home page or another page after successful login
        window.location.href = 'home.html'; // or wherever you want to redirect the user
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/wrong-password') {
          alert('Incorrect password, please try again');
        } else if (errorCode === 'auth/user-not-found') {
          alert('No account found with this email');
        } else if (errorCode === 'auth/invalid-email') {
          alert('Invalid email format');
        } else {
          alert('Login failed, please try again later');
        }
      });
  });
}
