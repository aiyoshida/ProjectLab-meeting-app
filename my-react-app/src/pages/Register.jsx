//import './Register.css';
import icon from '../images/icon.png';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from "moment-timezone";
import axios from "axios";


export default function Register() {
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('');
  const timezones = moment.tz.names(); //list of all timezone with IANA
  const [gmail, setGmail] = useState('');

  const navigate = useNavigate();
  const divRef = useRef(null);
  //for holding DOM, value. give this to Google SDK later.

  //will delete here later
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, gmail, timezone }),
      });

      const data = await response.json();
      localStorage.setItem('userId', data.userId);
      navigate('/homepage');
    } catch (error) {
      console.error(error);
      alert('Registration failed');
    }
  };

  //Google SDK initialzation, renderButton, callback registration
  //useEffect = 
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
        const email = payload.email;
        const name = payload.name;
        const picture = payload.picture;

        //POST
        try{
        const response = await axios.post(`http://localhost:8000/register/${sub}` ,
          {email : email, 
           name : name, 
           pic : picture})
           console.log("Response from server : ", response.data);

          }catch (err){
            console.error("Error happened : " ,err);
          }
        
        // ID token in resp.credential
        // fetch("/api/auth/google", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   credentials: "include", // Cookie
        //   body: JSON.stringify({ id_token: resp.credential })
        // });

        // const token = resp.credential;
        // console.log("Raw ID Token:", token);
        // const payload = JSON.parse(atob(token.split('.')[1]));
        // console.log("Decoded payload:", payload);
      },
    });

    // draw google button to the divRef.current div
    google.accounts.id.renderButton(divRef.current, {
      theme: "outline",
      size: "large",
    });
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
