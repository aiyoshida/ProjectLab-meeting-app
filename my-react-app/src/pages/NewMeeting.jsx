import React from "react";
import NewMeetingLeftSideBar from '../components/NewMeetingLeftSideBar';
import NewMeetingCalendar from '../components/NewMeetingCalendar';
import  { useState } from "react";




function NewMeeting(){
     //hold invitess value in parent page, and share
     const [checkedInvitees, setCheckedInvitees] = useState([])
     const [meetingTitle, setMeetingTitle] = useState("")
     const [slotDuration, setSlotDuration] = useState("00:30:00")

     return(
          <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden bg-[#fbf7f8] md:h-screen md:flex-row md:overflow-hidden">
                <NewMeetingLeftSideBar
                    value={slotDuration} 
                    onChange={setSlotDuration}
                    checkedInvitees={checkedInvitees}
                    setCheckedInvitees={setCheckedInvitees}
                    meetingTitle = {meetingTitle}
                    setMeetingTitle={setMeetingTitle}
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
