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
               <div className="left-sidebar">

                    <div className="brand-row">
                         <img src={icon} alt='icon' className="icon"/>
                         <h3 className="brand">AcrossTime</h3>
                    </div>
               

                         {/* タイムゾーン（表示専用） */}
                         <div className="section">
                              <label className="label">Your Timezone</label>
                              <div className="readonly-box">{timezone}</div>
                              </div>

                              {/* Duration（固定の30分表示） */}
                              <div className="section">
                              <label className="label">Duration</label>
                              <div className="readonly-box">30 min</div>
                              </div>
                              <div className="invitees">

                     {/* invite*/} 
                         {mockInvitees.map((user, index) => (
                         <label key={index} className="invite-item">
                         <input type="checkbox" defaultChecked />
                         <div className="invite-text">
                              <div>{user.name}</div>
                              <div className="email">{user.email}</div>
                         </div>
                         </label>
                         ))}
                    </div>



               </div>
      
     );
}
