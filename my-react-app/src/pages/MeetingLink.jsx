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
          const newStart = moment(info.start).format("YYYY-MM-DDTHH:mm");
          const alreadySelected = selectedSlots.some(slot => moment(slot.start).format("YYYY-MM-DDTHH:mm") === newStart);
          if (alreadySelected) {
               alert("This timeslot is already selected!");
               return;
          }
          setSelectedSlots([...selectedSlots, {
               start: info.start.toISOString(),//idk why but UTC is Japanese time (utc+9) is here.
               end: info.end.toISOString(),
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
    const startFormattedS = moment.utc(s.start).tz(timezone).format("YYYY-MM-DD-HH-mm");
    const startFormattedSlot = moment.utc(slot.start).format("YYYY-MM-DD-HH-mm");

    const endFormattedS = moment.utc(s.end).tz(timezone).format("YYYY-MM-DD-HH-mm");
    const endFormattedSlot = moment.utc(slot.end).format("YYYY-MM-DD-HH-mm");

    const startMatch = startFormattedS === startFormattedSlot;
    const endMatch = endFormattedS === endFormattedSlot;

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
                                   console.log(selectInfo);
                                   const selectedStart = moment.utc(selectInfo.start).format("YYYY-MM-DDTHH:mm");
                                   const selectedEnd = moment.utc(selectInfo.end).format("YYYY-MM-DDTHH:mm");
                                   console.log(selectInfo.start);
                                   console.log(selectInfo.end);
                                   console.log("waaaaa", selectedStart, selectedEnd);

                                   return availableSlots.some(slot => {
                                   const slotStart = moment.utc(slot.start).tz(timezone).format("YYYY-MM-DDTHH:mm");
                                   const slotEnd = moment.utc(slot.end).tz(timezone).format("YYYY-MM-DDTHH:mm");
                                   console.log("wiiiiiii", slotStart, slotEnd);

                                   return slotStart === selectedStart && slotEnd === selectedEnd;
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
                              
                              plugins={[timeGridPlugin, interactionPlugin]}
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