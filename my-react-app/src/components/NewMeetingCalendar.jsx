import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { DateTime } from "luxon";
import { useNavigate } from 'react-router-dom';
import { API, FRONT } from "../lib/api" //using this accesable by Render
import getBaseTime from '../utils/getBaseTime';


export default function NewMeetingCalendar({ checkedInvitees = [], meetingTitle = "", slotDuration }) {
     const userId = localStorage.getItem('userId');
     const [selectedSlots, setSelectedSlots] = useState([]);
     const [timezone, setTimezone] = useState("Europe/Budapest");
     const [viewKey, setViewKey] = useState(0);
     const [slotLayout, setSlotLayout] = useState([]);
     const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
     const calendarRef = useRef(null); // to use ref to the fullcalendar. For React DOM.
     const calendarBodyRef = useRef(null);
     const timezoneRowsRef = useRef(null);
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

     useEffect(() => {
          const mediaQuery = window.matchMedia('(max-width: 767px)');
          const updateView = (event) => {
               const mobile = event.matches;
               setIsMobile(mobile);
               calendarRef.current?.getApi?.().changeView(mobile ? 'timeGridDay' : 'timeGridWeek');
          };

          updateView(mediaQuery);
          mediaQuery.addEventListener('change', updateView);
          return () => mediaQuery.removeEventListener('change', updateView);
     }, []);

     useEffect(() => {
          const body = calendarBodyRef.current;
          if (!body) return undefined;
          let scrollFrame = null;

          const syncTimezoneScroll = (scrollTop) => {
               if (timezoneRowsRef.current) {
                    timezoneRowsRef.current.style.transform = `translate3d(0, ${-scrollTop}px, 0)`;
               }
          };

          const measureSlots = () => {
               const bodyRect = body.getBoundingClientRect();
               const slotElements = body.querySelectorAll('.fc-timegrid-slot-lane[data-time]');
               const slotScroller = Array.from(body.querySelectorAll('.fc-scroller'))
                    .find((element) => element.querySelector('.fc-timegrid-slots'));
               const scrollTop = slotScroller?.scrollTop || 0;
               setSlotLayout(Array.from(slotElements).map((element) => {
                    const rect = element.getBoundingClientRect();
                    return {
                         time: element.getAttribute('data-time'),
                         top: rect.top - bodyRect.top + scrollTop,
                         height: rect.height,
                    };
               }));
               syncTimezoneScroll(scrollTop);
          };

          const frame = requestAnimationFrame(measureSlots);
          const observer = new ResizeObserver(measureSlots);
          observer.observe(body);
          const slotScroller = Array.from(body.querySelectorAll('.fc-scroller'))
               .find((element) => element.querySelector('.fc-timegrid-slots'));
          const handleCalendarScroll = () => {
               if (scrollFrame !== null) return;
               scrollFrame = requestAnimationFrame(() => {
                    syncTimezoneScroll(slotScroller?.scrollTop || 0);
                    scrollFrame = null;
               });
          };
          slotScroller?.addEventListener('scroll', handleCalendarScroll, { passive: true });

          return () => {
               cancelAnimationFrame(frame);
               if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
               observer.disconnect();
               slotScroller?.removeEventListener('scroll', handleCalendarScroll);
          };
     }, [slotDuration, timezone, viewKey, checkedInvitees.length]);


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


     const addSelectedSlot = (start, end) => {
          if (selectedSlots.length >= 10) {
               alert("Only 10 timeslots are available!");
               return;
          }
          const newStart = start.toUTC().toISO();
          const newEnd = end.toUTC().toISO();

          const alreadySelected = selectedSlots.some(slot => slot.start === newStart);

          if (alreadySelected) {
               alert("This timeslot is already selected!");
               return;
          }

          setSelectedSlots([...selectedSlots, {
               start: newStart,
               end: newEnd,
          }]);
     };

     const handleSelect = (info) => {
          addSelectedSlot(
               DateTime.fromISO(info.startStr, { setZone: true }),
               DateTime.fromISO(info.endStr, { setZone: true }),
          );
     };

     const handleMobileDateClick = (info) => {
          if (!isMobile) return;
          const [hours, minutes, seconds] = slotDuration.split(':').map(Number);
          const start = DateTime.fromISO(info.dateStr, { setZone: true });
          addSelectedSlot(start, start.plus({ hours, minutes, seconds }));
     };

     const getAvailabilityClass = (hour) => {
          if (hour >= 9 && hour < 19) return "timezone-slot-good";
          if (hour >= 7 && hour < 22) return "timezone-slot-okay";
          return "timezone-slot-poor";
     };

     const comparisonSlots = getBaseTime(timezone, slotDuration);


     return (
          <div className="relative flex h-[48rem] min-h-[48rem] w-full min-w-0 max-w-5xl flex-none flex-col gap-2 p-2 sm:p-3 md:h-full md:min-h-0 md:flex-1">

               <section className="calendar-surface flex flex-1 flex-col w-full min-w-0 min-h-0 overflow-hidden">
                    <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-[#eee4e7] pb-2 text-[11px] text-[#776b70] sm:gap-x-4 sm:text-xs">
                         <span className="font-semibold text-[#4b3f43]">Time comparison</span>
                         <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#81d7bb]" />09–19</span>
                         <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#d4c89d]" />07–09 / 19–22</span>
                         <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#caabb6]" />22–07</span>
                         <span className="ml-auto font-medium">{timezone.split('/').pop()}</span>
                         {isMobile && <span className="w-full text-[#94878c]">Tap a time to select it</span>}
                    </div>
                    <div ref={calendarBodyRef} className="flex min-h-0 flex-1 gap-1.5 overflow-hidden sm:gap-2">
                         {checkedInvitees.length > 0 && (
                              <div
                                   className="relative shrink-0 overflow-hidden rounded-xl border border-[#eadde1] bg-[#faf7f8]"
                                   style={{ width: `${checkedInvitees.length * (isMobile ? 3.35 : 4.25)}rem` }}
                              >
                                   <div
                                        className="absolute left-0 right-0 z-10 grid border-b border-[#eadde1] bg-white shadow-[0_4px_10px_rgba(89,55,65,0.05)]"
                                        style={{
                                             bottom: slotLayout.length ? `${calendarBodyRef.current?.clientHeight - slotLayout[0].top}px` : 'auto',
                                             gridTemplateColumns: `repeat(${checkedInvitees.length}, minmax(0, 1fr))`,
                                        }}
                                   >
                                        {checkedInvitees.map((invitee) => (
                                             <div key={invitee.sub || invitee.id} className="truncate px-1 py-2 text-center text-[11px] font-semibold text-[#5f4d53]" title={invitee.timezone}>
                                                  {invitee.timezone.split('/').pop()}
                                             </div>
                                        ))}
                                   </div>
                                   <div
                                        className="absolute bottom-0 left-0 right-0 overflow-hidden"
                                        style={{ top: slotLayout.length ? `${slotLayout[0].top}px` : '100%' }}
                                   >
                                        <div ref={timezoneRowsRef} className="absolute inset-0 will-change-transform">
                                             {slotLayout.map((slot, slotIndex) => {
                                                  const creatorTime = comparisonSlots[slotIndex];
                                                  if (!creatorTime) return null;
                                                  return (
                                                       <div
                                                            key={slot.time}
                                                            className="absolute left-0 right-0 grid gap-px"
                                                            style={{
                                                                 top: `${slot.top - slotLayout[0].top}px`,
                                                                 height: `${slot.height}px`,
                                                                 gridTemplateColumns: `repeat(${checkedInvitees.length}, minmax(0, 1fr))`,
                                                            }}
                                                       >
                                                            {checkedInvitees.map((invitee) => {
                                                                 const inviteeTime = creatorTime.setZone(invitee.timezone);
                                                                 return (
                                                                      <div key={invitee.sub || invitee.id} className={`flex items-center justify-center text-xs font-semibold ${getAvailabilityClass(inviteeTime.hour)}`}>
                                                                           {inviteeTime.toFormat('HH:mm')}
                                                                      </div>
                                                                 );
                                                            })}
                                                       </div>
                                                  );
                                             })}
                                        </div>
                                   </div>
                              </div>
                         )}
                         <div className="min-w-0 flex-1">
                         <FullCalendar
                         ref={calendarRef}
                         timeZone={timezone}
                         headerToolbar={{
                              left: 'title',
                              center: '',
                              right: 'prev,next today'
                         }}
                         titleFormat={{ month: 'short', year: 'numeric' }}
                         dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
                         dayHeaderContent={(arg) => {
                              const headerDate = DateTime.fromJSDate(arg.date, { zone: timezone });
                              return (
                              <div className="flex flex-col items-center">
                                   <span className="text-xs text-gray-500 font-medium uppercase">
                                        {headerDate.toFormat('ccc')}
                                   </span>
                                   <span className="text-lg text-gray-900 font-semibold">
                                        {headerDate.day}
                                   </span>
                              </div>
                              );
                         }}
                         selectable={!isMobile}
                         select={handleSelect}
                         dateClick={handleMobileDateClick}
                         plugins={[timeGridPlugin, interactionPlugin, momentTimezonePlugin]}
                         initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
                         slotDuration={slotDuration}
                         slotMinTime="09:00:00"
                         slotMaxTime="22:00:00"
                         slotLabelFormat={{
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                         }}
                         height="100%"
                         expandRows={true}
                         handleWindowResize={false}
                         allDaySlot={false}
                         firstDay={new Date().getDay()}
                         datesSet={() => setViewKey((current) => current + 1)}
                         events={selectedSlots.map(slot => ({
                              start: slot.start,
                              end: slot.end,
                              display: 'background',
                              backgroundColor: "red",
                         }))
                         }
                         />
                         </div>
                    </div>
               </section>
               <button onClick={handleShare} className="primary-button shrink-0 self-end md:sticky md:right-3">Share</button>
          </div>
     );

}
