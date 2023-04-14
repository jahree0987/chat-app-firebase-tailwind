import React, { useState, useRef, useEffect } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { SingleContact } from "./SingleContact";
import "../css/singleContact.css";

export const Contact = (props) => {
  const addContactRef = useRef(null);
  const userRef = collection(db, "user");
  const contactRef = collection(db, "contacts");
  const user = auth.currentUser;
  const [allContacts, setAllContacts] = useState([]);
  const [newContact, setNewContact] = useState("");

  async function addContactInDb(emailValue) {
    const data = await getDocs(userRef);
    const filteredData = data.docs.map((doc) => doc.data().email);
    const checkEmailinDb = filteredData.indexOf(emailValue);

    if (checkEmailinDb !== -1) {
      await addDoc(contactRef, {
        user: user.email,
        addedContact: emailValue,
        room: [user.email, emailValue],
        notifications: 0,
      });
      await addDoc(contactRef, {
        user: emailValue,
        addedContact: user.email,
        room: [user.email, emailValue],
        notifications: 0,
      });
      console.log(`successfully added ${emailValue} into your contacts`);
    } else {
      console.log("email is not registered yet");
    }
  }

  useEffect(() => {
     const getAllcontacts = async (userEmail) => {
      const allContactQuery = query(contactRef, where("user", "==", userEmail));
      onSnapshot(allContactQuery, (snapShot) => {
        let contacts = [];

        snapShot.forEach((docs) => {
          const getPhotoContactQuery = query(
            userRef,
            where("email", "==", docs.data().addedContact)
          );
          onSnapshot(getPhotoContactQuery, (snapShot) => {
            snapShot.forEach((doc) => {
              const imageUrl = doc.data().image;
              const contactName = doc.data().name;
              contacts.push({
                ...docs.data(),
                id: docs.id,
                isHeld: false,
                image: imageUrl,
                contactName: contactName,
              });
            });
            setAllContacts(contacts);
          });

          // contacts.push({
          //   ...docs.data(),
          //   id: docs.id,
          //   isHeld: false,

          // });
        });
      });
    };

    getAllcontacts(user.email);
    // console.log(allContacts);
  }, []);

  async function chooseContact(contactObj) {
    const { setRoom, setCurrentContact } = props;

    const newContacts = allContacts.map((contact) => {
      return contact.id === contactObj.id
        ? {
            ...contact,
            isHeld: true,
            notifications: 0,
          }
        : {
            ...contact,
            isHeld: false,
          };
    });

    const docRef = doc(db, "contacts", contactObj.id);
    await setDoc(
      docRef,
      {
        notifications: 0,
      },
      { merge: true }
    );

    setAllContacts(newContacts);
    setCurrentContact(contactObj);
    setRoom(contactObj.room);
  }

  const allContactElements = allContacts.map((contact) => {
    return (
      <div
        className={
          contact.isHeld
            ? "contact-info bg-teal-500 rounded-lg"
            : "contact-info bg-zinc-300 rounded-lg"
        }
        id={contact.id}
        onClick={() => chooseContact(contact)}
      >
        <SingleContact
          contactName={contact.addedContact}
          notifications={contact.notifications}
          key={contact.id}
          id={contact.id}
          image={contact.image}
          name={contact.contactName}
          setAllContacts={setAllContacts}
        />
      </div>
    );
  });

  return (
    <div className="ml-5">
      <div className="add-contact space-x-4 mt-4 mb-10 bg-zinc-200 p-5 rounded-lg">
        <label>Add contact</label>
        <input
          ref={addContactRef}
          className="bg-zinc-100"
          placeholder="Enter email ...."
        />
        <button
          className="px-2 rounded-xl text-white bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
          onClick={() => addContactInDb(addContactRef.current.value)}
        >
          Add
        </button>
      </div>

      <div className="space-y-2 ">
        <h2 className="text-3xl">Contacts</h2>
        {allContactElements}
      </div>
    </div>
  );
};

