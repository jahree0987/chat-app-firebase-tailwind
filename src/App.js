import "./App.css";
import React, { useState, useRef } from "react";
import { Auth } from "./components/Auth";
import Cookies from "universal-cookie";
import { Chat } from "./components/Chat";
import { Profile } from "./components/Profile";
import { auth } from "./firebase-config";
import { Contact } from "./components/Contact";
import { signOut } from "firebase/auth";
const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState();
  const [currentContact, setCurrentContact] = useState();
  const user = auth.currentUser;
  const roomRef = useRef(null);

  const signUserOut = async () => {
    await signOut(auth);
//     cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
  };

  if (!isAuth) {
    return (
      <div className="App">
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }
  return (
    <div className="main bg-zinc-100 h-screen font-sans">
      <div className="header flex">
        <Profile name={user.displayName} photo={user.photoURL} />
        <button
          className="w-20 px-3 text-white bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
          onClick={signUserOut}
        >
          Sign Out
        </button>
      </div>
      <div>
        <div className="flex mt-20">
          <div className="">
            <Contact setRoom={setRoom} setCurrentContact={setCurrentContact} />
          </div>
          <div className="room-container mt-5 overflow-y-auto w-200 mr-20 ">
            {room && <Chat room={room} currentContact={currentContact} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
