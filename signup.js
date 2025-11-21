// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Signup form handler
const signupForm = document.querySelector('.signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Get the values from the input fields
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirm-password').value;

    // Validate if the passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Create the user using Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Store additional user information in Firestore
        await setDoc(doc(db, "users", user.uid), {
          fullName: name,
          email: email,
          createdAt: new Date()
        });

        // After successful signup, alert the user and redirect
        alert('Signup successful! Welcome to SwiftBuy!');
        window.location.href = 'login.html'; // Redirect to login page
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          alert('This email is already registered');
        } else if (errorCode === 'auth/weak-password') {
          alert('Password should be at least 6 characters');
        } else {
          alert('Signup failed, please try again');
        }
      });
  });
}
