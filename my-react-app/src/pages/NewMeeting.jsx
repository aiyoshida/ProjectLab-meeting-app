import React from "react";
import NewMeetingLeftSideBar from '../components/NewMeetingLeftSideBar';
import NewMeetingOthersTime from '../components/NewMeetingOthersTime';
import NewMeetingCalendar from '../components/NewMeetingCalendar';
import  { useState, useEffect } from "react";



function NewMeeting(){
     //hold invitess value in parent page, and share
     const [checkedInvitees, setCheckedInvitees] = useState([])
     const [meetingTitle, setMeetingTitle] = useState("")
     const [slotDuration, setSlotDuration] = useState("00:30:00")

     return(
          <div className="flex h-screen box-border">
                <NewMeetingLeftSideBar
                    value={slotDuration} 
                    onChange={setSlotDuration}
                    checkedInvitees={checkedInvitees}
                    setCheckedInvitees={setCheckedInvitees}
                    meetingTitle = {meetingTitle}
                    setMeetingTitle={setMeetingTitle}
               />
                <NewMeetingOthersTime 
                    checkedInvitees={checkedInvitees}
               />
                <NewMeetingCalendar 
                    slotDuration={slotDuration}
                    checkedInvitees={checkedInvitees}
                    meetingTitle={meetingTitle}
               />
          </div>
     );
}
export default NewMeeting;
