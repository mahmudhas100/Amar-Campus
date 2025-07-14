import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged as firebaseOnAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from './firebase';
const googleProvider = new GoogleAuthProvider();

export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const onAuthStateChanged = (callback) => firebaseOnAuthStateChanged(auth, callback);
