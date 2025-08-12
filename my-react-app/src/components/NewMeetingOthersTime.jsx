import './NewMeetingOthersTime.css';
import getBaseTime from '../utils/getBaseTime';
import React from "react";
import { DateTime } from 'luxon';
import axios from "axios";
import { useEffect, useState } from "react";


export default function NewMeetingOthersTime({checkedInvitees=[]}) {
     const [timezone, setTimezone] = useState("Europe/Budapest");

     //basetime 
     const basetime = getBaseTime(timezone);
     const storedId = localStorage.getItem('userId');
     const userId = storedId ? parseInt(storedId) : 1;
     console.log("checkedInvitees:", checkedInvitees)


          //get userId's timezone
     useEffect(() => {
          axios
               .get(`http://localhost:8000/newmeetingothers/timezone/${userId}`)
               .then((res) => {
               setTimezone(res.data.timezone)
               console.log(res.data.timezone);
          })
               .catch ((err) => {
               console.error("error: ", err)
          })
},[])


     return(
          <div className="othertimezone-container">
               
          <div className="othertimezone-header-row">
               {checkedInvitees.map((tz) =>(
                    <div key={tz.id} className="othertimezone-head-item"> {tz.timezone.split("/").pop()}</div>
               ))}
          </div>

          <div>
               {basetime.map((slot,idx)=>(
                    <div className="othertimezone-time-row" key={idx}>
                         {checkedInvitees.map((tz)=>(
                          <div key={tz.id} className="othertimezone-time-item">
                              <div>{slot.setZone(tz.timezone).toFormat("HH:mm")}</div>
                         </div>
                         ))}
                    </div>
               ))}
          </div>

          </div>
     )
};