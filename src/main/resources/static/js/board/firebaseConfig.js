// /js/firebaseConfig.js
import {initializeApp} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {getStorage} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAxVgjUbHY3I6Omjg_-nXkSwQbc0UFRQcg",
    authDomain: "selfit-2a00d.firebaseapp.com",
    projectId: "selfit-2a00d",
    storageBucket: "selfit-2a00d.firebasestorage.app",
    messagingSenderId: "90629857713",
    appId: "1:90629857713:web:f3984699c070c6c5e89d90"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export {storage};
