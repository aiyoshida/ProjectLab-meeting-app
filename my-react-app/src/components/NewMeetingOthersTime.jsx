import './NewMeetingOthersTime.css';
import getBaseTime from '../utils/getBaseTime';
import React from "react";
import { DateTime } from 'luxon';


export default function NewMeetingOthersTime({checkedInvitees=[]}) {

     //basetime 
     const basetime = getBaseTime();
     console.log("checkedInvitees:", checkedInvitees)


     return(
          <div className="othertimezone-container">
               
          <div className="othertimezone-header-row">
               {checkedInvitees.map((tz) =>(
                    <div key={tz.id} className="othertimezone-head-item"> {tz.timezone}</div>
               ))}
          </div>

          <div>
               {basetime.map((slot,idx)=>(
                    <div className="othertimezone-time-row" key={idx}>
                         {checkedInvitees.map((tz)=>(

                          <div key={tz.id} className="othertimezone-time-item">
                              {slot.setZone(tz.timezone).toFormat("H:mm")}
                         </div>
                         ))}
                    </div>
               ))}
          </div>

          </div>
     )
};