import { Calendar } from '@fullcalendar/core';
import momentPlugin from '@fullcalendar/moment';
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import moment from "moment-timezone";
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { DateTime } from "luxon";
import { useNavigate } from 'react-router-dom';
import { API, FRONT } from "../lib/api" //using this accesable by Render


export default function NewMeetingCalendar({ checkedInvitees = [], meetingTitle = "", slotDuration }) {
     const userId = localStorage.getItem('userId');
     const [selectedSlots, setSelectedSlots] = useState([]);
     const [timezone, setTimezone] = useState("Europe/Budapest");
     const calendarRef = useRef(null); // to use ref to the fullcalendar. For React DOM.

     //TODO: take user's timezone from upper parents, not both from components. doubled now.
     useEffect(() => {
          console.log(userId);
          if (!userId)
               alert("There is no userId available!");
          console.log("initial timezone: ", timezone);
          axios.get(`${API}/newmeeting/timezone/${userId}`).then(res => {
               setTimezone(res.data.timezone);
               console.log("Received timezone: ", res.data.timezone);
          })
               .catch(err => {
                    console.error("Failed to get user's timezone", err);
               });

     }, [userId]);


     //to force fullcalendar to re-render.
     useEffect(() => {
          const api = calendarRef.current?.getApi?.();
          if (api) api.setOption("slotDuration", slotDuration);
          setSelectedSlots([]); //to reset selected timeslots
     }, [slotDuration]);


     const handleShare = async () => {
          try {
               console.log("This is invitee:", checkedInvitees);
               const payload = {
                    title: meetingTitle,
                    timezone: timezone,
                    creator_user_sub: userId,
                    invitees: checkedInvitees.map(invitee => invitee.sub),
                    slots: selectedSlots.map(slot => ({
                         start: slot.start,
                         end: slot.end
                    })),
                    slot_duration: slotDuration,
                    url: "https://across-time.vercel.app//meetinglink"
               };
               console.log("NewMeetingCalendar: payload ", payload);

               const response = await axios.post(`${API}/newmeeting/${userId}`, payload);
               console.log("NewMeetingCalendar: Meeting created", response.data);

               //sending email to invitees
               console.log("NewMeetingCalendar: invitee's email ", checkedInvitees.map(invitee => invitee.gmail));
               const result = await axios.post(`${API}/send_email/${userId}`, {
                    receivers: checkedInvitees.map(invitee => invitee.gmail),
                    subject: "Acrosstime: you are invited to a meeting to join",
                    body: 
                    `Hi! This is AcrossTime

                    You are invited to vote this meeting!
                    URL: ${FRONT}/meetinglink/${response.data.meeting_id}
                    `
                    ,
                    
               });
               if (result) {
                    let message = checkedInvitees.map((invitee) => {
                         return `Meeting invitation is sent to ${invitee.name} : ${invitee.gmail}`;
                    }).join("\n")
                    alert(`meeting url: https://across-time.vercel.app//meetinglink/${response.data.meeting_id} \n ${message}`);
               } else {
                    alert(`sending email has failed!`);
                    console.log(`NewMeetingCalendar: Result is ${result} : sending email has failed!`);
               }

               //navigate user to created voting screen
               navigate(`/meetinglink/${response.data.meeting_id}`);
               checkedInvitees.forEach((user) => {
                    console.log(`NewMeetingCalendar: Send to: ${user.gmail}, meeting url: https://across-time.vercel.app//meetinglink/${response.data.meeting_id}`);
               });


          } catch (error) {
               console.error("NewMeetingCalendar: Failed to create meeting:", error);
          }
     }
     const navigate = useNavigate();


     const handleSelect = (info) => {
          if (selectedSlots.length >= 10) {
               alert("Only 10 timeslots are available!");
               return;
          }
          console.log(info);
          //make the selected slot UTC time and save to selected timeslots.
          const newStart = moment.parseZone(info.startStr).utc().toISOString();
          const newEnd = moment.parseZone(info.endStr).utc().toISOString();
          console.log("newStart", newStart);

          const alreadySelected = selectedSlots.some(slot => slot.start === newStart);

          if (alreadySelected) {
               alert("This timeslot is already selected!");
               return;
          }

          setSelectedSlots([...selectedSlots, {
               start: newStart,
               end: newEnd,
          }]);
          console.log("selectedslots: ", selectedSlots);
     };


     return (
          <div className="relative w-full max-w-4xl ml-auto px-4">

               <section className="flex-1 w-full min-w-0 overflow-hidden">
                    <FullCalendar
                         timeZone={timezone}
                         headerToolbar={{
                              left: 'title',
                              center: '',
                              right: 'prev,next today'
                         }}
                         titleFormat={{ month: 'short', year: 'numeric' }}
                         dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
                         dayHeaderContent={(arg) => (
                              <div className="flex flex-col items-center">
                                   <span className="text-xs text-gray-500 font-medium uppercase">
                                        {arg.date.toLocaleString('en-US', { weekday: 'short' })}
                                   </span>
                                   <span className="text-lg text-gray-900 font-semibold">
                                        {arg.date.getDate()}
                                   </span>
                              </div>
                         )}
                         selectable={true}
                         select={handleSelect}
                         plugins={[timeGridPlugin, interactionPlugin, momentTimezonePlugin]}
                         initialView="timeGridWeek"
                         slotDuration={slotDuration}
                         slotMinTime="09:00:00"
                         slotMaxTime="22:00:00"
                         slotLabelFormat={{
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                         }}
                         //height="auto"
                         height={793}   // make this to fixed height
                         expandRows={true}
                         handleWindowResize={false}
                         allDaySlot={false}
                         firstDay={new Date().getDay()}
                         events={selectedSlots.map(slot => ({
                              start: slot.start,
                              end: slot.end,
                              display: 'background',
                              backgroundColor: "red",
                         }))

                         }
                    />
               </section>
               <button onClick={handleShare} className="btn btn-sm flex ml-auto gap-2">Share</button>
          </div>
     );

}