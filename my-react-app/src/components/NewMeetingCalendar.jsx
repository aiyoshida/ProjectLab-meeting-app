import {gapi} from 'gapi-script' ;
import{useEffect} from 'react';
import './NewMeetingCalendar.css';
import React from "react";

const CLIENT_ID = '4575472657-7depp48v9d4ct8lhrsf84roap62a2t6g.apps.googleusercontent.com';
const API_KEY = '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';
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

export default function NewMeetingCalendar(){

     return(
          <div className="calendar-container">

          </div>
     );

}