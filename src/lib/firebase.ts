import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCO6oOQRU8hNMUHryb-QYbtm4ziicjg05o",
  authDomain: "tokeneur-c6dc9.firebaseapp.com",
  projectId: "tokeneur-c6dc9",
  storageBucket: "tokeneur-c6dc9.firebasestorage.app",
  messagingSenderId: "1077427703401",
  appId: "1:1077427703401:web:c77726bc772fd2e90d5cf8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);