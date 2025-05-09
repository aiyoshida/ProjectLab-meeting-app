import React from "react";
import './NewMeeting.css';
import NewMeetingLeftSideBar from '../components/NewMeetingLeftSideBar';
import NewMeetingOthersTime from '../components/NewMeetingOthersTime';
import NewMeetingCalendar from '../components/NewMeetingCalendar';
import  { useState, useEffect } from "react";



function NewMeeting(){
     //hold invitess value in parent page, and share
     const [checkedInvitees, setCheckedInvitees] = useState([])
     return(
          <div className="main-wrapper">
                <NewMeetingLeftSideBar
                checkedInvitees={checkedInvitees}
                setCheckedInvitees={setCheckedInvitees}
                />
                <NewMeetingOthersTime checkedInvitees={checkedInvitees}/>
                <NewMeetingCalendar checkedInvitees={checkedInvitees}/>
          </div>
     );
}
export default NewMeeting;
