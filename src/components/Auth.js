import { auth, provider, db } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
  doc,
} from "firebase/firestore";
import Cookies from "universal-cookie";
import { useState } from "react";
const cookies = new Cookies();

export const Auth = (props) => {
  
  const userRef = collection(db, "user");

  function checkEmailInDb(userEmail) {
    return new Promise((resolve, reject) => {
      const checkUserQuery = query(userRef, where("email", "==", userEmail));
      const emailArr = [];
      onSnapshot(checkUserQuery, (snapShot) => {
        snapShot.forEach(async (doc) => {
          const newEmail = doc.data().email;
          if (newEmail === userEmail) {
            emailArr.push(newEmail);
            resolve(true);
          }
        });
      });
    });
  }

  const signInWithGoogle = async () => {
    const { setIsAuth } = props;
    try {
      const result = await signInWithPopup(auth, provider);
//       cookies.set("auth-token", result.user.refreshToken);
      const { user } = result;

      const emailData = await getDocs(userRef);
      const filteredData = emailData.docs.map((doc) => doc.data().email);
      const emailChecker = filteredData.indexOf(user.email);

      if (emailChecker !== -1) {
        console.log("email is already in DB");
        setIsAuth(true);
      } else {
        await addDoc(userRef, {
          email: user.email,
          image: user.photoURL,
          uid: user.uid,
          name: user.displayName,
          createdAt: serverTimestamp(),
        });
        console.log("succesfully registered");
        setIsAuth(true);
      }

      // const emailChecker = await checkEmailInDb(user.email);
      // console.log(emailChecker);
      // if (emailChecker === true) {
      //   console.log("email is already on DB");
      // } else {
      //   await addDoc(userRef, {
      //     email: user.email,
      //     image: user.photoURL,
      //     uid: user.uid,
      //     name: user.displayName,
      //     createdAt: serverTimestamp(),
      //   });
      //   console.log("succesfully registered");
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth">
      <p>Sign in with Google to Continue</p>
      <button onClick={signInWithGoogle} className="rounded-xl w-40 text-white bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300">Sign in With Google</button>
    </div>
  );
};
