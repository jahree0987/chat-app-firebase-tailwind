import { useState } from "react";
import "../css/singleContact.css";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase-config";
export const SingleContact = (props) => {
  

  const deleteContact = async (id) => {
    await deleteDoc(doc(db, "contacts", id));
    alert("successfully deleted contact");
  };

  return (
    <>
      <div className="flex space-x-2 p-5 ">
        <img src={props.image} className="h-12 rounded-full" />

        <p className="capitalize pt-3">{props.name} </p>
        <div>
         
            <div className="text-red-500 pt-4 text-vs font-bold flex space-x-1 w-40 ">
              <p>
                {props.notifications > 1 ? `${props.notifications} unread messages`:null}
              </p>
            </div>
  
        </div>
        <button
          className="-mt-2 rounded-full border-double border-4 w-8 h-8 bg-red-500 text-red-200 "
          onClick={() => deleteContact(props.id)}
        >
          x
        </button>
      </div>
    </>
  );
};
