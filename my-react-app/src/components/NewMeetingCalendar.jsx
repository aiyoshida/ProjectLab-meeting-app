import { gapi } from 'gapi-script';
import React, { useState, useEffect } from "react";
import './NewMeetingCalendar.css';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

import { useNavigate } from 'react-router-dom';


export default function NewMeetingCalendar({ checkedInvitees = [], meetingTitle="" }) {
     const userId = 1
     

     const handleShare = async () => {
          try {
               const payload = {
                    title: meetingTitle,
                    creator_user_id: userId,
                    timezone: "Europe/Budapest",
                    invitees: checkedInvitees.map(user => user.id), 
                    slots: selectedSlots.map(slot => ({
                         start: slot.start,
                         end: slot.end
                    })),
                    url: "http://localhost:3000/meetinglink"
               };

               const response = await axios.post(`http://localhost:8000/newmeeting/${userId}`, payload);
               console.log("Meeting created:", response.data);

               navigate(`/meetinglink/${response.data.meeting_id}`);
               checkedInvitees.forEach((user) => {
                    console.log(`Send to: ${user.gmail}, meeting url: http://localhost:3000/meetinglink/${response.data.meeting_id}`);
               });
          } catch (error) {
               console.error("Failed to create meeting:", error);
          }
     }
     const navigate = useNavigate();
     const goToHomePage = () => {
          navigate('/homepage');
     }
     const [selectedSlots, setSelectedSlots] = useState([]);
     const handleSelect = (info) => {
          if (selectedSlots.length >= 10) {
               alert("Only 10 timeslots are available!");
               return;
          }
          const newStart = info.start.toISOString();
          const alreadySelected = selectedSlots.some(slot => slot.start.toISOString() === newStart);
          if (alreadySelected) {
               alert("This timeslot is already selected!");
               return;
          }
          setSelectedSlots([...selectedSlots, {
               start: info.start,
               end: info.end,
          }]);
     };




     return (
          <div className="calendar-container">

               <button onClick={handleShare} className="calendar-container-sharebutton">Share</button>
               <button onClick={goToHomePage} className="calendar-container-close">✕</button>


               <div style={{ width: "95%" }}>
                    <FullCalendar
                         selectable={true}
                         select={handleSelect}
                         plugins={[timeGridPlugin, interactionPlugin]}
                         initialView="timeGridWeek"
                         slotDuration="00:30:00"
                         slotMinTime="09:00:00"
                         slotMaxTime="22:00:00"
                         slotLabelFormat={{
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                         }}
                         height="auto"
                         nowIndicator={true}
                         allDaySlot={false}
                         firstDay={new Date().getDay()}
                         timeZone="local"
                         events={selectedSlots.map(slot => ({
                              start: slot.start,
                              end: slot.end,
                              display: 'background',
                              backgroundColor: '#ee827c',
                              className: 'new-meeting-selectable-slot',
                         }))

                         }
                    />
               </div>
          </div>
     );

}