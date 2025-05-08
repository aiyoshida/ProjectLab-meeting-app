import React from "react";
import './NewMeetingLeftSideBar.css';
import icon from '../images/icon.png';
import { useState, useEffect } from "react"
import axios from "axios"

const mockInvitees = [
     { name: "Katreen", email: "example@gmail.com", country:"Jordan🇯🇴" },
     { name: "Tariq", email: "example2@gmail.com", country:"Japan🇯🇵" },
     { name: "Ramiz", email: "example3@gmail.com", country:"Hungary🇭🇺" },
     { name: "Rauf", email: "example4@gmail.com", country:"Azerbaijan🇦🇿" },
];

export default function NewMeetingLeftSideBar() {
     const [invitees, setInvitees] = useState("")
     const userId = 1

     const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
     return (
          <div className="new-leftsidebar-sidebar">

               <div className="new-leftsidebar-brand-row">
                    <img src={icon} alt='icon' className="new-leftsidebar-icon" />
                    <h3 className="new-leftsidebar-brand">AcrossTime</h3>
               </div>
               {/*title input - mandatory to write*/}
               <div className="new-leftsidebar-section">
                    <label className="new-leftsidebar-label">Meeting Title</label>
                    <input type="text" className="new-leftsidebar-readonly-box" placeholder="*Enter meeting title"/>
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
                         {mockInvitees.map((user, index) => (
                              <label key={index} className="new-leftsidebar-invite-item">
                                   <div className="new-leftsidebar-invite-first-row">
                                        <input className="new-leftsidebar-checkbox" type="checkbox" defaultChecked={false} />
                                        <div>{user.name}</div>
                                        <div className="new-leftsidebar-country"> in {user.country}</div>
                                   </div>
                                   
                                   <div className="new-leftsidebar-email">{user.email}</div>

                              </label>
                         ))}
                    </div>
               </div>



          </div>

     );
}
