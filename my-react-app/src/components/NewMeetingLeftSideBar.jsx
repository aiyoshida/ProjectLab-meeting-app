import React from "react";
import './NewMeetingLeftSideBar.css';
import icon from '../images/icon.png';
import { useState, useEffect } from "react"
import axios from "axios"

export default function NewMeetingLeftSideBar({ checkedInvitees = [], setCheckedInvitees, meetingTitle = "", setMeetingTitle }) {
     const [invitees, setInvitees] = useState([]);
     const [timezone, setTimezone] = useState("UTC");

     const storedId = localStorage.getItem('userId');
     const userId = storedId ? parseInt(storedId) : null;

     const handleCheck = (invitee) => {
          const alreadyChecked = checkedInvitees.some(i => i.id === invitee.id)
          if (alreadyChecked) {
               //uncheck
               setCheckedInvitees(checkedInvitees.filter(i => i.id !== invitee.id))
          } else {
               if (checkedInvitees.length < 2) {
                    setCheckedInvitees([...checkedInvitees, invitee])
               }
               else {
                    alert("It is only up to 2 people")
               }
          }
     }
     //get checked invitees
     useEffect(() => {
          console.log("checkedInvitees:", checkedInvitees)
     }, [checkedInvitees])

     //get contacts
     useEffect(() => {
          axios
               .get(`http://localhost:8000/newmeeting/${userId}`)
               .then((res) => {
                    setInvitees(res.data.contacts)
               })
               .catch((err) => {
                    console.error("error: ", err)
               })
     }, [])

     //get userId's timezone
     useEffect(() => {
          axios
               .get(`http://localhost:8000/newmeeting/timezone/${userId}`)
               .then((res) => {
               setTimezone(res.data.timezone)
               console.log(res.data.timezone);
          })
               .catch ((err) => {
               console.error("error: ", err)
          })
},[])



return (
     <div className="new-leftsidebar-sidebar">

          <div className="new-leftsidebar-brand-row">
               <img src={icon} alt='icon' className="new-leftsidebar-icon" />
               <h3 className="new-leftsidebar-brand">AcrossTime</h3>
          </div>
          {/*title input - mandatory to write*/}
          <div className="new-leftsidebar-section">
               <label className="new-leftsidebar-label">Meeting Title</label>
               <input
                    type="text"
                    className="new-leftsidebar-readonly-box"
                    placeholder="*Enter meeting title"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)} />
          </div>

          {/*timezone - now Budapest only*/}
          <div className="new-leftsidebar-section">
               <label className="new-leftsidebar-label">Your Timezone</label>
               <div className="new-leftsidebar-readonly-box">{timezone}</div>
          </div>

          {/* Duration - now 30min only*/}
          <div className="new-leftsidebar-section">
               <label className="new-leftsidebar-label">Duration</label>
               <div className="new-leftsidebar-readonly-box">30 min</div>
          </div>


          {/* invite*/}
          <div className="new-leftsidebar-section">
               <label className="new-leftsidebar-label">Invite</label>
               <input className="new-leftsidebar-readonly-box" placeholder="search contact" />
               <div className="new-leftsidebar-invitees">
                    {invitees.map((user, index) => (
                         <label key={index} className="new-leftsidebar-invite-item">
                              <div className="new-leftsidebar-invite-first-row">
                                   <input className="new-leftsidebar-checkbox" type="checkbox" checked={checkedInvitees.some(i => i.id === user.id)} onChange={() => handleCheck(user)} />
                                   <div>{user.name}</div>
                                   <div className="new-leftsidebar-country">in {user.timezone}</div>
                              </div>

                              <div className="new-leftsidebar-email">{user.gmail}</div>

                         </label>
                    ))}
               </div>
          </div>



     </div>

);
}
