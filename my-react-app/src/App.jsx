//import icon from './images/icon.png';
import React, { useEffect } from "react";
import './App.css';
//import { useState } from 'react';
import Register from './pages/Register';
import Setting from './pages/Setting';
import Contact from './pages/Contact';
import Homepage from './pages/Homepage';
import NewMeeting from './pages/NewMeeting';
import MeetingLink from './pages/MeetingLink';
import {UserProvider} from './contexts/UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { API } from "./lib/api";
import FinalizeMeeting from "./pages/FinalizeMeeting";

function App() {
    useEffect(() => {
    fetch(`${API}/health`)
      .then((res) => res.json())
      .then((data) => console.log("API response:", data))
      .catch((err) => console.error("API error:", err));
  }, []);
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/setting" element={<Setting />}/>
          <Route path="/contact" element={<Contact />}/>
          <Route path="/newmeeting" element={<NewMeeting />}/>
          <Route path="/homepage" element={<Homepage />}/>
          <Route path="/meetinglink/:meetingId" element={<MeetingLink />}/>
          <Route path="/finalizemeeting/:meetingId" element={<FinalizeMeeting />}/>
      </Routes>
    </Router>
  </UserProvider>

  );
}

export default App;
