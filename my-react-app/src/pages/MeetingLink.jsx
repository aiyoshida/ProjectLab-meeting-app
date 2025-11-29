import { useParams, useLocation } from "react-router-dom";
// useParams is to tamle element from url, uselocation is to pass data
//uselocation is for temporary, will use db soon.
import icon from '../images/icon.png';
import watch from '../images/watch.svg';
import timezone_icon from '../images/timezone_icon.svg';
import good from '../images/good.svg';
import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import momentPlugin from '@fullcalendar/moment-timezone';
import { DateTime } from "luxon";
import { API } from "../lib/api" //using this accesable by Render


export default function MeetingLink() {
     const userId = localStorage.getItem('userId');
     const { meetingId } = useParams();
     const [participants, setParticipants] = useState([]);
     const [creator, setCreator] = useState({ sub: "", gmail: "", picture: '', name: '', timezone: '', });
     const [slotDuration, setSlotDuration] = useState("00:30:00");
     const [selectedSlots, setSelectedSlots] = useState([]);
     const [availableSlots, setAvailableSlots] = useState([]);
     const [timezone, setTimezone] = useState("UTC");
     const navigate = useNavigate();
     const goToHomePage = () => {
          navigate('/homepage');
     }


     const handleSelect = (info) => {
          if (selectedSlots.length >= 10) {
               alert("Only 10 timeslots are available!");
               return;
          }
          console.log("handleSelect: ", info);
          const newStart = DateTime.fromISO(info.startStr).toUTC();
          const alreadySelected = selectedSlots.some((slot) => {
               const slotStart = DateTime.fromISO(slot.start, { zone: "utc" }).toUTC();
               return slotStart.hasSame(newStart, "minute");
          });
          if (alreadySelected) {
               alert("This timeslot is already selected!");
               return;
          }
          setSelectedSlots([
               ...selectedSlots,
               {
                    start: DateTime.fromISO(info.startStr).toUTC().toISO(),
                    end: DateTime.fromISO(info.endStr).toUTC().toISO(),
               }]);
     };

     const handleSubmit = async () => {
          if (selectedSlots.length === 0) {
               alert("Please select at least one timeslot.");
               return;
          }
          try {
               //since gettime is too precise, use +-1sec
               const voted_date_ids = selectedSlots.map(slot => {
                    const match = availableSlots.find(s => {
                         {/*compare with UTC time*/ }
                         const startFormattedS = DateTime.fromISO(s.start, { zone: "utc" }).toUTC();
                         const startFormattedSlot = DateTime.fromISO(slot.start, { zone: "utc" }).toUTC();

                         const endFormattedS = DateTime.fromISO(s.end, { zone: "utc" }).toUTC();
                         const endFormattedSlot = DateTime.fromISO(slot.end, { zone: "utc" }).toUTC();

                         const startMatch = startFormattedS.hasSame(startFormattedSlot, "minute");
                         const endMatch = endFormattedS.hasSame(endFormattedSlot, "minute");

                         return startMatch && endMatch;
                    });

                    console.log("MeetingLink.jsx availableSlots: ", availableSlots);
                    console.log("MeetingLink.jsx selectedSlots: ", selectedSlots);

                    if (!match) {
                         throw new Error("Invalid selected slot.");
                    }

                    return match.id;
               });

               const payload = {
                    user_id: userId,
                    slots: voted_date_ids,
               };
               console.log(payload);
               await axios.post(`${API}/meetinglink/${meetingId}/vote`, payload);

               alert("Vote submitted!");
               navigate('/homepage');
          } catch (error) {
               console.error("Error submitting vote", error);
               alert("Failed to submit vote");
          }
     };

     //get main user's timezone
     useEffect(() => {
          console.log(userId);
          if (!userId)
               alert("There is no userId available!");
          console.log("initial timezone: ", timezone);
          axios.get(`${API}/meetinglink/timezone/${userId}`).then(res => {
               setTimezone(res.data.timezone);
               console.log("Received timezone: ", res.data.timezone);
          })
               .catch(err => {
                    console.error("Failed to get user's timezone", err);
               });

     }, [userId]);

     //get participants' info and available slots
     useEffect(() => {
          if (!meetingId) return;
          console.log(timezone);

          axios
               .get(`${API}/meetinglink/${meetingId}`)
               .then((res) => {
                    setParticipants(res.data.contacts || []);
                    setAvailableSlots(res.data.available_slots || []);
                    setSlotDuration(res.data.slotDuration);
                    setCreator(res.data.creator);
                    console.log("MeetingLink.jsx received creator", res.data.creator)
                    console.log("MeetingLink.jsx received participants: ", res.data.contacts);
                    console.log("MeetingLink.jsx available slots: ", res.data.available_slots);
                    console.log("MeetingLink.jsx slot_duration:", res.data.slotDuration);
               })
               .catch((err) => {
                    console.error("Failed to load meeting data", err);
                    setParticipants([]);
                    setAvailableSlots([]);
                    setCreator([]);
               });
     }, [meetingId]);


     return (
          <div className="">
               <div className="" >

                    <div className="flex justify-start items-center hover:cursor-pointer m-3" onClick={goToHomePage}>
                         <img src={icon} alt='icon' className="h-16 w-16" />
                         <h3 className="text-2xl">AcrossTime</h3>
                    </div>

                    <div className="items-baseline p-7">
                         <div className="flex justify-start items-center " >
                              {/* watch icon took from this website 
                              https://icon-rainbow.com/%e6%99%82%e8%a8%88%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3%e7%b4%a0%e6%9d%90-6/ */}
                              <img src={watch} alt='watch' className="h-5 w-5" />
                              <p className="ml-2">{slotDuration} min</p>
                         </div>

                         <div className="flex justify-start items-center my-2" >
                              {/* timezone icon took from this website 
                         https://icon-rainbow.com/%e4%b8%96%e7%95%8c%e5%9c%b0%e5%9b%b3%e3%81%ae%e3%83%95%e3%83%aa%e3%83%bc%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3-1/ */}
                              <img src={timezone_icon} alt='timezone_icon' className="h-5 w-5" />
                              <p className="ml-2">{timezone}</p>
                         </div>

                         <div className="flex flex-col my-4 ">
                              <label className="text-lg">Created By</label>
                         </div>

                         <div className="flex items-center mb-4">

                              <div className="flex items-center gap-3 ml-3 ">
                                   <div className="avatar">
                                        <div className="mask mask-squircle h-12 w-12">
                                             <img
                                                  src={creator.picture}
                                                  alt="Avatar Tailwind CSS Component" />
                                        </div>
                                   </div>
                                   <div>
                                        <div className="font-bold">{creator.name}</div>
                                        <div className="text-sm opacity-50">{creator.timezone.split("/").pop()}</div>
                                   </div>
                              </div>
                         </div>


                         <div className="flex flex-col my-4 ">
                              <label className="text-lg">Voted?</label>
                         </div>

                         <div className="ml-2">
                              {participants.map((user, index) => (
                                   <label key={index} className="">
                                        <div className="flex items-center mb-4">
                                             <label>
                                                  <input type="checkbox" className="checkbox" checked={user.voted} />
                                             </label>

                                             <div className="flex items-center gap-3 ml-3 ">
                                                  <div className="avatar">
                                                       <div className="mask mask-squircle h-12 w-12">
                                                            <img
                                                                 src={user.picture}
                                                                 alt="Avatar Tailwind CSS Component" />
                                                       </div>
                                                  </div>
                                                  <div>
                                                       <div className="font-bold">{user.name}</div>
                                                       <div className="text-sm opacity-50">{user.timezone.split("/").pop()}</div>
                                                  </div>
                                             </div>
                                        </div>


                                   </label>
                              ))}
                         </div>

                         <div>
                              <label className="text-lg my-3" >Vote dates</label>

                              <div className="space-y-1">
                                   {availableSlots.map((date) => {
                                        const d = DateTime.fromISO(date.start, { zone: "utc" }).setZone(timezone);
                                        return (
                                             <div className="flex items-center ml-6" key={date.id}>
                                                  {d.toFormat("ccc, LLLL d")}
                                                  {/*moment.utc(date.start).tz(timezone).format("ddd, MMMM D")*/}
                                                  {/* https://v4.daisyui.com/components/badge/ # Badge in a button jsx */}
                                                  <div className="flex items-center px-2 py-1 rounded-md text-md font-semibold text-gray-700 bg-transparent border border-blue-500 ml-3">
                                                       {d.toFormat("H:mm")}
                                                       {/*moment.utc(date.start).tz(timezone).format("H:mm")*/}
                                                       <div className="badge badge-sm bg-transparent border-none">
                                                            {/* Took good icon from here
                                                       https://icon-rainbow.com/%e3%81%84%e3%81%84%e3%81%ad%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3%e7%b4%a0%e6%9d%90-1/  */}
                                                            <img src={good} alt='good' className="h-5 w-5" />
                                                       </div>
                                                       <div>
                                                            <p>{date.vote_count}</p>
                                                       </div>
                                                  </div>
                                             </div>
                                        );
                                   })}
                              </div>
                         </div>
                    </div>
               </div>


               <div className="fixed left-[480px] top-0 h-screen w-[945px]">
                    <button onClick={handleSubmit} className="fixed right-[45px] bottom-[2px] bg-black text-white p-[5px] w-[70px] rounded-[8px] text-[15px]">Submit</button>

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
                                   plugins={[timeGridPlugin, interactionPlugin, momentPlugin, momentTimezonePlugin]}
                                   initialView="timeGridWeek"
                                   slotDuration={slotDuration}
                                   slotMinTime="09:00:00"
                                   slotMaxTime="33:00:00"
                                   slotLabelFormat={{
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                   }}
                                   height={800}   // make this to fixed height
                                   expandRows={true}
                                   handleWindowResize={false}
                                   allDaySlot={false}
                                   firstDay={new Date().getDay()}
                                   selectAllow={(selectInfo) => {
                                        console.log("MeetingLink.jsx selectedInfo OBJ: ", selectInfo);
                                        {/*since ISOString cannot directly compared.compare with UTC*/ }
                                        const selectedStart = DateTime.fromISO(selectInfo.startStr).toUTC();
                                        const selectedEnd = DateTime.fromISO(selectInfo.endStr).toUTC();
                                        console.log("MeetingLink.jsx", selectInfo.start);
                                        console.log("MeetingLink.jsx", selectInfo.end);
                                        console.log("MeetingLink.jsx selectInfo: ", selectedStart, selectedEnd);

                                        return availableSlots.some(slot => {
                                             const slotStart = DateTime.fromISO(slot.start, { zone: "utc" });
                                             const slotEnd = DateTime.fromISO(slot.end, { zone: "utc" });
                                             console.log("MeetingLink.jsx availableSlot", slotStart, slotEnd);
                                             const startMatch = selectedStart.hasSame(slotStart, "minute");
                                             const endMatch = selectedEnd.hasSame(slotEnd, "minute");
                                             return startMatch && endMatch;
                                             // return selectedStart.isSame(slotStart, 'minute') && selectedEnd.isSame(slotEnd, 'minute');
                                        });
                                   }}

                                   events={[
                                        ...availableSlots.map(slot => {
                                             const start = DateTime.fromISO(slot.start, { zone: "utc" }).setZone(timezone).toISO();
                                             const end = DateTime.fromISO(slot.end, { zone: "utc" }).setZone(timezone).toISO();

                                             return {
                                                  start,
                                                  end,
                                                  display: "background",
                                                  allDay: false,
                                                  backgroundColor: "#a2d5f2",
                                                  className: "calendar-available-slot",
                                             };
                                        }),

                                        ...selectedSlots.map(slot => ({
                                             start: slot.start,
                                             end: slot.end,
                                             display: "background",
                                             backgroundColor: "#f28b82",
                                             className: "calendar-selected-slot",
                                        })),
                                   ]}

                              />
                         </section>


                    </div>
               </div>

          </div>
     );
}