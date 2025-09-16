//import './Register.css';
import icon from '../images/icon.png';
import { useState, useEffect, useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from "moment-timezone";



export default function Register() {
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('');
  const timezones = moment.tz.names(); //list of all timezone with IANA
  const [gmail, setGmail] = useState('');

  const navigate = useNavigate();
  const divRef = useRef(null);
  //for holding DOM, value. give this to Google SDK later.
  const goToHomePage = () => {
    navigate('/homepage');
  }

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

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/register/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gmail }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem('userId', data.userId);
      navigate('/homepage');
    } catch (error) {
      console.error("Login error:", error);
      alert('Login failed. Please check your Gmail.');
    }
  };

    useEffect(() => {
    const g = window.google; // obj from Google's SDK
    if (!g || !divRef.current) return; //if no SDK load, do nothing

    g.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: (resp) => {
        // ID token in resp.credential
        fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Cookie
          body: JSON.stringify({ id_token: resp.credential })
        });
      },
    });

    // draw google button to the divRef.current div
    g.accounts.id.renderButton(divRef.current, {
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
              Coordinate global teams with clarity, speed, and zero confusion.
              Say goodbye to “What time is it for you?” forever.
            </p>
            {/* <button className="btn bg-white text-black border-[#e5e5e5]" onClick={goToHomePage}> 
              <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
              Login with Google
            </button> */}
            <div ref={divRef} /> 

          </div>
        </div>
      </div>


    </div>

  )
}
