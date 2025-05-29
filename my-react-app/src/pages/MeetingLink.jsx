import './MeetingLink.css';
import { useParams, useLocation } from "react-router-dom";
// useParams is to tamle element from url, uselocation is to pass data
//uselocation is for temporary, will use db soon.
import NewMeetingCalendar from '../components/NewMeetingCalendar';
import icon from '../images/icon.png';
import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import moment from "moment-timezone";
import momentTimezonePlugin from '@fullcalendar/moment-timezone';



export default function MeetingLink() {
     const storedId = localStorage.getItem('userId');
     const userId = storedId ? parseInt(storedId) : null;
     const { meetingId } = useParams();
     const [participants, setParticipants] = useState([])
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
          const newStart = moment.utc(info.startStr);
          const alreadySelected = selectedSlots.some(slot => moment.utc(slot.startStr).isSame(newStart, "munite"));
          if (alreadySelected) {
               alert("This timeslot is already selected!");
               return;
          }
          setSelectedSlots([...selectedSlots, {
               start: moment.parseZone(info.startStr).utc().toISOString(),
               end: moment.parseZone(info.endStr).utc().toISOString(),
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
     {/*compare with UTC time*/}
    const startFormattedS = moment.utc(s.start);
    const startFormattedSlot = moment.utc(slot.start);

    const endFormattedS = moment.utc(s.end);
    const endFormattedSlot = moment.utc(slot.end);

    const startMatch = startFormattedS.isSame(startFormattedSlot, "minute");
    const endMatch = endFormattedS.isSame(endFormattedSlot, "minute");

    return startMatch && endMatch;
  });

  console.log("availableSlots", availableSlots);
  console.log("selectedSlots: ", selectedSlots);

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
          await axios.post(`http://localhost:8000/meetinglink/${meetingId}/vote`, payload);
          

          alert("Vote submitted!");
          navigate('/homepage');
     } catch (error) {
          console.error("Error submitting vote", error);
          alert("Failed to submit vote");
     }
};

     //get main user's timezone
     useEffect(()=>{
          console.log(userId);
          if(!userId) 
               alert("There is no userId available!");
          console.log("initial timezone: ", timezone);
          axios.get(`http://localhost:8000/meetinglink/timezone/${userId}`).then(res=>{
               setTimezone(res.data.timezone);
               console.log("Received timezone: ", res.data.timezone);
          })
          .catch(err=>{
               console.error("Failed to get user's timezone", err);
          });
     
     },[userId]);

     //get participants' info and available slots
     useEffect(() => {
          if (!meetingId) return;
          console.log(timezone);

          axios
               .get(`http://localhost:8000/meetinglink/${meetingId}`)
               .then((res) => {
                    setParticipants(res.data.contacts || []);
                    setAvailableSlots(res.data.available_slots || []);
                    console.log("received participants: ", res.data.contacts);
                    console.log("available slots: " , res.data.available_slots);
               })
               .catch((err) => {
                    console.error("Failed to load meeting data", err);
                    setParticipants([]);
                    setAvailableSlots([]);
               });
     }, [meetingId]);


     return (
          <div className="meeting-link-section">
               <div className="meeting-link" >

                    <div className="meeting-link-brand-row">
                         <img src={icon} alt='icon' className="meeting-link-icon" />
                         <h3 className="meeting-link-brand">AcrossTime</h3>
                    </div>

                    <div className="meeting-link-section">
                         <p className="meeting-link-participants" >Participants</p>

                         {participants.map((user) => (
                              <div key={user.id} className="new-leftsidebar-invite-item">
                                        <div className="new-leftsidebar-invite-first-row">
                                             <div>{user.name}</div>
                                             <div className="new-leftsidebar-country">in {user.timezone}</div>
                                        </div>
                                        <div className="new-leftsidebar-status">
                                             {user.voted ? "✅ already voted" : "🕒 not voted yet"}
                                        </div>
                              </div>
                         ))}
                    </div>

                    <div>
                         <p className="meeting-link-vote-dates" >Vote dates</p>
                         
                              {availableSlots.map((date)=>(
                                        <div className = "meeting-link-votes" key={date.id}>
                                             {moment.utc(date.start).tz(timezone).format("YYYY/MM/DD (ddd) HH:mm")}〜
                                             {moment.utc(date.end).tz(timezone).format("HH:mm")} #votes: {date.vote_count}
                                             {console.log("date start: ", date.start)}
                                             {console.log("date start: ", date.end)}
                                             {console.log("waAAAAA", moment("2025-05-25T03:00:00").tz(timezone).format("YYYY/MM/DD HH:mm"))}
                                        </div>

                              ))}
                         

                    </div>


               </div>


               <div className="calendar-container">

                    <button onClick={handleSubmit} className="calendar-container-sharebutton">Submit</button>
                    <button onClick={goToHomePage} className="calendar-container-close">✕</button>


                    <div style={{ width: "95%" }}>
                         <FullCalendar
                              key={timezone}
                              timeZone={timezone}
                              selectable={true}
                                   selectAllow={(selectInfo) => {
                                   console.log("selectedInfo OBJ", selectInfo);
                                   {/*since ISOString cannot directly compared.compare with UTC*/}
                                   const selectedStart = moment.utc(selectInfo.startStr);
                                   const selectedEnd = moment.utc(selectInfo.endStr);
                                   console.log(selectInfo.start);
                                   console.log(selectInfo.end);
                                   console.log("selectInfo: ", selectedStart, selectedEnd);

                                   return availableSlots.some(slot => {
                                   const slotStart = moment.utc(slot.start);
                                   const slotEnd = moment.utc(slot.end);
                                   console.log("availableSlot", slotStart, slotEnd);

                                   return selectedStart.isSame(slotStart, 'minute') && selectedEnd.isSame(slotEnd, 'minute');
                                   });
                                   }}
                              select={handleSelect}
                              events={[
                                   ...availableSlots.map(slot => ({
                                        start: moment.utc(slot.start).tz(timezone).format(),
                                        end: moment.utc(slot.end).tz(timezone).format(),
                                        display: 'background',
                                        allDay: false,
                                        backgroundColor: '#a2d5f2',  
                                        className: 'calendar-available-slot',
                                   }))
                                   ,
                                   ...selectedSlots.map(slot => ({
                                        start: slot.start,
                                        end: slot.end,
                                        display: 'background',
                                        backgroundColor: '#f28b82',  
                                        className: 'calendar-selected-slot',
                                   }))
                                   ,
                              ]}
                              
                              plugins={[timeGridPlugin, interactionPlugin, momentTimezonePlugin]}
                              initialView="timeGridWeek"
                              slotDuration="00:30:00"
                              firstDay={new Date().getDay()}
                              allDaySlot={false}
                         />


                    </div>
               </div>

          </div>
     );
}