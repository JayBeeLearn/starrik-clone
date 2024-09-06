import React, { useState } from "react";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth, storage } from "../../firebase";

function SubscribeInput() {
  const [inputEmail, setInputEmail] = useState("");
  const [subscribe, setSubscribe] = useState(false);

 const userRegData = {
    inputEmail,
    dateCreated: serverTimestamp(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await setDoc(doc(collection(db, "newsletter")), userRegData);

    setSubscribe(true);

    setTimeout(() => {
      setSubscribe(false);
    }, 6500);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <i class="fa-regular fa-bell"></i>
        <input
          type="text"
          name="email"
          placeholder="Enter email address"
          value={inputEmail}
          onChange={(e) => {
            setInputEmail(e.target.value);
          }}
        />
        <button type="submit" class="button button-2">
          Subscribe
        </button>
      </form>
      {subscribe && (
        <p className="my-4 bg-white text-success border-round-sm border px-4 py-2"> Newsletter subscription for {inputEmail} is successful</p>
      )}
    </div>
  );
}

export default SubscribeInput;
