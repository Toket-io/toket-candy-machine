import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// AUTH
export const auth = getAuth(app);
export const firebaseOnAuthStateChanged = onAuthStateChanged;
export const firebaseSignInAnonymously = signInAnonymously;

// STORAGE
const storage = getStorage();
export const firebaseUploadNewBytes = async (path, file) => {
  try {
    const fileRef = ref(storage, path);
    const result = await uploadBytes(fileRef, file);

    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error("*AC Error: ", error);
  }
};

export default app;
