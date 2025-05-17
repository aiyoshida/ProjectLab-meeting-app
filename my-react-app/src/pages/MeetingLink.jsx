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



export default function MeetingLink() {
     const userId = 2; //change to login info later
     const { meetingId } = useParams();
     const [participants, setParticipants] = useState([])
     const [selectedSlots, setSelectedSlots] = useState([]);
     const [availableSlots, setAvailableSlots] = useState([]);
     const navigate = useNavigate();
     const goToHomePage = () => {
          navigate('/homepage');
     }
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

     const handleSubmit = async () => {
     if (selectedSlots.length === 0) {
          alert("Please select at least one timeslot.");
          return;
     }

     try {
          //since gettime is too precise, use +-1sec
          const voted_date_ids = selectedSlots.map(slot => {
            const match = availableSlots.find(s =>
                Math.abs(new Date(s.start).getTime() - new Date(slot.start).getTime()) < 1000 &&
                Math.abs(new Date(s.end).getTime() - new Date(slot.end).getTime()) < 1000
            );
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


     useEffect(() => {
          if (!meetingId) return;

          axios
               .get(`http://localhost:8000/meetinglink/${meetingId}`)
               .then((res) => {
                    setParticipants(res.data.contacts || []);
                    setAvailableSlots(res.data.available_slots || []);
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
                                                  {date.start}〜{date.end} votes: {date.vote_count}
                                        </div>
                              ))}
                         

                    </div>


               </div>


               <div className="calendar-container">

                    <button onClick={handleSubmit} className="calendar-container-sharebutton">Submit</button>
                    <button onClick={goToHomePage} className="calendar-container-close">✕</button>


                    <div style={{ width: "95%" }}>
                         <FullCalendar
                              selectable={true}
                              selectAllow={(selectInfo) => {
                                   return availableSlots.some(slot =>
                                        new Date(slot.start).getTime() === selectInfo.start.getTime() &&
                                        new Date(slot.end).getTime() === selectInfo.end.getTime()
                                   );
                              }}
                              select={handleSelect}
                              events={[
                                   ...availableSlots.map(slot => ({
                                        start: slot.start,
                                        end: slot.end,
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
                              timeZone="local"
                              firstDay={new Date().getDay()}
                              nowIndicator={true}
                              allDaySlot={false}
                         />


                    </div>
               </div>

          </div>
     );
}