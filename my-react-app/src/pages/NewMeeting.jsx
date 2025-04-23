import React from "react";
import './NewMeeting.css';
import NewMeetingLeftSideBar from '../components/NewMeetingLeftSideBar';
import NewMeetingOthersTime from '../components/NewMeetingOthersTime';
import NewMeetingCalendar from '../components/NewMeetingCalendar';

function NewMeeting(){
     return(
          <div className="main-wrapper">
                <NewMeetingLeftSideBar/>
                <NewMeetingOthersTime/>
                <NewMeetingCalendar/>
          </div>
     );
}
export default NewMeeting;
