import {gapi} from 'gapi-script' ;
import React, { useState, useEffect } from "react";
import './NewMeetingCalendar.css';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = '4575472657-7depp48v9d4ct8lhrsf84roap62a2t6g.apps.googleusercontent.com';
const API_KEY = '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';
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

export default function NewMeetingCalendar(){
     const navigate = useNavigate();
     const goToHomePage =()=>{
          navigate('/homepage');
 }

     return(
          <div className="calendar-container">
               <button className="calendar-container-sharebutton">Share</button>
               <button onClick={goToHomePage} className="calendar-container-close">✕</button>

          </div>
     );

}