// Firebase Config (YOURS)
const firebaseConfig = {
  apiKey: "AIzaSyC0J_M3hzdn67OkmxOdB5nXbX7x6TTJ96E",
  authDomain: "calorie-coach-42fd1.firebaseapp.com",
  projectId: "calorie-coach-42fd1",
  storageBucket: "calorie-coach-42fd1.firebasestorage.app",
  messagingSenderId: "840998585030",
  appId: "1:840998585030:web:fe52516639295571fecdc7",
  measurementId: "G-PQG6LZ3QKS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore();
