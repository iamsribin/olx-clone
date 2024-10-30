import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import  {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyA0zC1gSjYuIdxeABcwTg_RXppKxBPl93c",
  authDomain: "olx-clon-4410c.firebaseapp.com",
  projectId: "olx-clon-4410c",
  storageBucket: "olx-clon-4410c.appspot.com",
  messagingSenderId: "455530075845",
  appId: "1:455530075845:web:c809cd7196f3d864aa02ac",
  measurementId: "G-7P415QTPP6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 
const storage = getStorage(app);
export { app, auth, db, storage }; 