// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTUmtx_j4NRwypK3tsDgA3V4UAwV-ftdE",
    authDomain: "food-menu-f6080.firebaseapp.com",
    projectId: "food-menu-f6080",
    storageBucket: "food-menu-f6080.firebasestorage.app",
    messagingSenderId: "443787754837",
    appId: "1:443787754837:web:c407392a1e59e3521ac3dc"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firebase services
window.db = firebase.firestore();
window.auth = firebase.auth();
window.storage = firebase.storage();