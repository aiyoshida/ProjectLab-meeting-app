import React from "react";
import './NewMeetingLeftSideBar.css';
import icon from '../images/icon.png';

const mockInvitees = [
     { name: "Katreen", email: "example@gmail.com" },
     { name: "Tariq", email: "example2@gmail.com" },
     { name: "Ramiz", email: "example3@gmail.com" },
   ];


export default function NewMeetingLeftSideBar() {
     const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
     return(
               <div className="new-leftsidebar-sidebar">

                    <div className="new-leftsidebar-brand-row">
                         <img src={icon} alt='icon' className="new-leftsidebar-icon"/>
                         <h3 className="new-leftsidebar-brand">AcrossTime</h3>
                    </div>
               

                         {/* タイムゾーン（表示専用） */}
                         <div className="new-leftsidebar-section">
                              <label className="new-leftsidebar-label">Your Timezone</label>
                              <div className="new-leftsidebar-readonly-box">{timezone}</div>
                              </div>

                              {/* Duration（固定の30分表示） */}
                              <div className="new-leftsidebar-section">
                              <label className="new-leftsidebar-label">Duration</label>
                              <div className="new-leftsidebar-readonly-box">30 min</div>
                              </div>


                    {/* invite*/} 
                    <div className="new-leftsidebar-section">
                    <label className="new-leftsidebar-label">Invite</label>
                    <input className="new-leftsidebar-readonly-box" placeholder="search contact"/>
                    <div className="new-leftsidebar-invitees">
                         {mockInvitees.map((user, index) => (
                         <label key={index} className="new-leftsidebar-invite-item">
                         <div className="new-leftsidebar-invite-first-row">
                         <input className="new-leftsidebar-checkbox" type="checkbox" defaultChecked />
                              <div>{user.name}</div>
                         </div>
                              <div className="new-leftsidebar-email">{user.email}</div>

                         </label>
                         ))}
                    </div>
                    </div>



               </div>
      
     );
}
