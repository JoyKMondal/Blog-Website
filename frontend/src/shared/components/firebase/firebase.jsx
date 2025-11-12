import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApBIx3H3g_AmR8yvrjEKeJ8KFmajxdOco",
  authDomain: "meet-up-app-6b65c.firebaseapp.com",
  databaseURL: "https://meet-up-app-6b65c-default-rtdb.firebaseio.com",
  projectId: "meet-up-app-6b65c",
  storageBucket: "meet-up-app-6b65c.appspot.com",
  messagingSenderId: "1026120998117",
  appId: "1:1026120998117:web:48661be5a9ca940821080c",
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });
  return user;
};
