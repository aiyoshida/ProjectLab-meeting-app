import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { API } from "../lib/api" //using this accesable by Render

export default function Register() {
  const { setUserId } = useUser(); //to call
  const navigate = useNavigate();
  const divRef = useRef(null);
  const initialized = useRef(false); //not to double initialize of GSI
  //for holding DOM, value. give this to Google SDK later.

  //only arrow func is accepted??
  const goToHomePage = () => {
    navigate('/homepage');
  }

  //Google SDK initialzation, renderButton, callback registration
  //FIX NEEDED : third gmail become garbled text + could not take pic info correctly.
  useEffect(() => {
    const google = window.google; // obj from Google's SDK
    if (!google || !divRef.current) return; //if no SDK load, do nothing

    //Decode base64 あとで自分で探す。
    function decodeJwt(token) {
      const base64 = token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      const json = atob(padded);
      return JSON.parse(json);
    }

    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: async (resp) => {

        const payload = decodeJwt(resp.credential);
        console.log("Devoded payload:", payload);
        const sub = payload.sub;
        const gmail = payload.email;
        const name = payload.name;
        const picture = payload.picture;

        console.log("AAAAA!!! user info: ", sub, gmail, name, picture);

        //POST
        try {
          const response = await axios.post(`${API}/register/${sub}`,
            {
              "gmail": gmail,
              "name": name,
              "pic": picture
            })
          console.log("Response from server : ", response.data);
          localStorage.setItem("userId", sub);
          setUserId(sub);
          goToHomePage();
        } catch (err) {
          console.error("Error happened : ", err);
        }},
    });

    // draw google button to the divRef.current div
    google.accounts.id.renderButton(divRef.current, {
      theme: "outline",
      size: "large",
    });

  const init = () => {
    if (initialized.current || !window.google || !divRef.current) return;
    initialized.current = true;

    function decodeJwt(token) {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      return JSON.parse(atob(padded));
    }

    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: async (resp) => {
        const payload = decodeJwt(resp.credential);
        const { sub, email: gmail, name, picture } = payload;

        try {
          const response = await axios.post(`${API}/register/${sub}`, { gmail, name, pic: picture });
          console.log("Response from server:", response.data);
          localStorage.setItem("userId", sub);
          setUserId(sub);
          goToHomePage();
        } catch (err) {
          console.error("Error happened:", err);
        }
      },
    });

    //fix button size
    window.google.accounts.id.renderButton(divRef.current, {
      theme: "outline",
      size: "large",
      width: 320, 
    });
  };

  // if sdk is loaded
  if (window.google && window.google.accounts) {
    init();
    return;
  }

  // if not, add script and init by onload 
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = init;
  document.head.appendChild(script);
}, []);

return (
  <div>
    <div className="hero bg-pink-100 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">
            Effortlessly schedule meetings across time zones.
            Do you have your friends or colleagues in the different time zones?
            Do you feel troublesome calculating "What is the best time for us" everytime?
            Then the best app is here for you!
          </p>
          <div ref={divRef} />
        </div>
      </div>
    </div>
  </div>

)
}
