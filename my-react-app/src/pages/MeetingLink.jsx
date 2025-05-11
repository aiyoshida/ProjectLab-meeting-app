import './MeetingLink.css';
import { useParams, useLocation } from "react-router-dom";
// useParams is to tamle element from url, uselocation is to pass data
//uselocation is for temporary, will use db soon.
import NewMeetingCalendar from '../components/NewMeetingCalendar';
import icon from '../images/icon.png';
import { useState, useEffect } from "react"
import axios from "axios"




export default function MeetingLink() {
     const { meetingId } = useParams();
     const [participants, setParticipants] = useState([])

     useEffect(() => {
          if (!meetingId) return;
          axios
               .get(`http://localhost:8000/meetinglink/${meetingId}`)
               .then((res) => {
                    setParticipants(res.data.contacts)
               })
               .catch((err) => {
                    console.error("error: ", err)
               })
     }, [meetingId])

     return (
          <div className="meeting-link-section">
               <div className="meeting-link" >

                    <div className="meeting-link-brand-row">
                         <img src={icon} alt='icon' className="meeting-link-icon" />
                         <h3 className="meeting-link-brand">AcrossTime</h3>
                    </div>

                    <div className="meeting-link-section">
                         <p className="meeting-link-participants" >Participants</p>

                         {participants.map((user, index) => (
                              <div className="new-leftsidebar-invite-item">
                                   <label key={index} >
                                        <div className="new-leftsidebar-invite-first-row">
                                             <div>{user.name}</div>
                                             <div className="new-leftsidebar-country">in {user.timezone}</div>
                                        </div>
                                        <div className="new-leftsidebar-status">
                                             {user.voted ? "✅ already voted" : "🕒 not voted yet"}
                                        </div>
                                   </label>
                              </div>
                         ))}
                    </div>


               </div>
               <NewMeetingCalendar />

          </div>
     );
}