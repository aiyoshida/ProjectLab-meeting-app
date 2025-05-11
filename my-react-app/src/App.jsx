import icon from './images/icon.png';
import './App.css';
import { useState } from 'react';
import Register from './pages/Register';
import Setting from './pages/Setting';
import Contact from './pages/Contact';
import Homepage from './pages/Homepage';
import NewMeeting from './pages/NewMeeting';
import MeetingLink from './pages/MeetingLink';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  
  return (
    <Router>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/setting" element={<Setting />}/>
      <Route path="/contact" element={<Contact />}/>
      <Route path="/newmeeting" element={<NewMeeting />}/>
      <Route path="/homepage" element={<Homepage />}/>
      <Route path="/meetinglink/:meetingId" element={<MeetingLink />}/>
    </Routes>
  </Router>

  );
}

export default App;
