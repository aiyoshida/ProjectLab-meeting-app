import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { DateTime } from "luxon";
import { useNavigate } from 'react-router-dom';
import { API, FRONT } from "../lib/api" //using this accesable by Render


export default function NewMeetingCalendar({ checkedInvitees = [], meetingTitle = "", slotDuration }) {
     const userId = localStorage.getItem('userId');
     const [selectedSlots, setSelectedSlots] = useState([]);
     const [timezone, setTimezone] = useState("Europe/Budapest");
     const calendarRef = useRef(null); // to use ref to the fullcalendar. For React DOM.
     const navigate = useNavigate();

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
                    url: `${FRONT}/meetinglink`
               };
               console.log("NewMeetingCalendar: payload ", payload);

               const response = await axios.post(`${API}/newmeeting/${userId}`, payload);
               console.log("NewMeetingCalendar: Meeting created", response.data);

               const meetingUrl = `${FRONT}/meetinglink/${response.data.meeting_id}`;
               try {
                    await navigator.clipboard.writeText(meetingUrl);
                    alert(`Meeting created. The sharing URL was copied:\n${meetingUrl}`);
               } catch {
                    alert(`Meeting created. Share this URL with participants:\n${meetingUrl}`);
               }

               //navigate user to created voting screen
               navigate(`/meetinglink/${response.data.meeting_id}`);


          } catch (error) {
               console.error("NewMeetingCalendar: Failed to create meeting:", error);
          }
     }


     const handleSelect = (info) => {
          if (selectedSlots.length >= 10) {
               alert("Only 10 timeslots are available!");
               return;
          }
          console.log(info);
          //make the selected slot UTC time and save to selected timeslots.
          const newStart = DateTime.fromISO(info.startStr, { setZone: true }).toUTC().toISO();
          const newEnd = DateTime.fromISO(info.endStr, { setZone: true }).toUTC().toISO();

          console.log("NewMeetingCalendar.jsx newStart: ", newStart);

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

     const getAvailabilityClass = (hour) => {
          if (hour >= 9 && hour < 19) return "timezone-slot-good";
          if (hour >= 7 && hour < 22) return "timezone-slot-okay";
          return "timezone-slot-poor";
     };

     const renderComparedTimes = (arg) => {
          const creatorTime = DateTime.fromJSDate(arg.date, { zone: timezone });
          const comparedTimes = [
               { key: "creator", label: creatorTime.toFormat("HH:mm"), className: "timezone-slot-owner" },
               ...checkedInvitees.map((invitee) => {
                    const inviteeTime = creatorTime.setZone(invitee.timezone);
                    return {
                         key: invitee.sub || invitee.id,
                         label: inviteeTime.toFormat("HH:mm"),
                         className: getAvailabilityClass(inviteeTime.hour),
                    };
               }),
          ];

          return (
               <div
                    className="timezone-slot-grid"
                    style={{ gridTemplateColumns: `repeat(${comparedTimes.length}, minmax(3.5rem, 1fr))` }}
               >
                    {comparedTimes.map((time) => (
                         <span key={time.key} className={`timezone-slot ${time.className}`}>
                              {time.label}
                         </span>
                    ))}
               </div>
          );
     };


     return (
          <div className="relative flex h-full min-w-0 max-w-5xl flex-1 flex-col gap-2 p-3">

               <section className="calendar-surface flex flex-1 flex-col w-full min-w-0 min-h-0 overflow-hidden">
                    <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#eee4e7] pb-2 text-xs text-[#776b70]">
                         <span className="font-semibold text-[#4b3f43]">Time comparison</span>
                         <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#81d7bb]" />09–19</span>
                         <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#d4c89d]" />07–09 / 19–22</span>
                         <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#caabb6]" />22–07</span>
                         <span className="ml-auto font-medium">{['You', ...checkedInvitees.map(invitee => invitee.timezone.split('/').pop())].join(' · ')}</span>
                    </div>
                    <div className="min-h-0 flex-1">
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
                         slotLabelContent={renderComparedTimes}
                         height="100%"
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
                    </div>
               </section>
               <button onClick={handleShare} className="primary-button shrink-0 self-end">Share</button>
          </div>
     );

}
