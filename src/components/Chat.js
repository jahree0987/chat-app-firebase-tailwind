import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";

export const Chat = (props) => {
  const { room, currentContact } = props; 

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    onSnapshot(queryMessages, (snapShot) => {
      let messages = [];
      snapShot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
  }, [room]);

  const getNotifications = async (id) => {
    const docRef = doc(db, "contacts", id);
    const docSnap = await getDoc(docRef);
    const currentNotifications = docSnap.data().notifications;

    return currentNotifications;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newMessage === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room: room,
    });

    let contactID = "";
    const contactIdquery = query(
      collection(db, "contacts"),
      where("user", "==", currentContact.addedContact)
    );

    const docSnap = await getDocs(contactIdquery);
    docSnap.forEach((doc) => {
      contactID = doc.id;
    });

    let finalNotifications = await getNotifications(contactID);

    const docRef = doc(db, "contacts", contactID);

    await setDoc(
      docRef,
      {
        notifications: (finalNotifications += 1),
      },
      { merge: true }
    );

    console.log(contactID ,auth.currentUser.email)
    setNewMessage("");
  };

  const messagesElement = messages.map((message) => (
    <div className="message" key={message.id}>
      <span className="user capitalize font-bold">{message.user}: </span>
      {message.text}
    </div>
  ));

  return (
    <div className="chat-app  bg-zinc-200 ml-40 overflow-y-auto max-h-128 w-128 h-128 relative">
      <div className="header bg-zinc-500 p-4 text-white mb-5 flex space-x-5">
        <img className="h-16 rounded-full" src={currentContact.image}/>
        <h1 className="text-2xl font-bold  pt-4 capitalize"> 
          {currentContact.contactName}
        </h1>
      </div>
      <div className="messages text-m space-y-2 ml-4">{messagesElement}</div>
      <form className="new-message-form space-x-16 ml-4" onSubmit={handleSubmit}>
        <input
          className="new-message-input w-4/6 h-8 rounded-sm"
          placeholder="type your message here..."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button
          type="submit"
          className="send-button  w-1/6 h-6 rounded-xl  text-white bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};
