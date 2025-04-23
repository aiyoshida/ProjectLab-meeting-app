import './NewMeetingOthersTime.css';
import getBaseTime from '../utils/getBaseTime';
import React from "react";
import { DateTime } from 'luxon';


export default function NewMeetingOthersTime() {

     //basetime 
     const basetime = getBaseTime();

     //example data
     const othertimezone = [
          {label:"Jordan", zone:"Asia/Amman"},
          {label:"Japan", zone:"Asia/Tokyo"},
     ];

     return(
          <div className="othertimezone-container">
          <div className="header-row">
               {othertimezone.map((tz) =>(
                    <div key={tz.zone} className="head-item"> {tz.label}</div>
               ))}
          </div>

          <div>
               {basetime.map((slot,idx)=>(
                    <div className="time-row" key={idx}>
                         {othertimezone.map((tz)=>(
                          <div key={tz.zone} className="time-item">
                         {slot.setZone(tz.zone).toFormat("H:mm")}
                         </div>
                         ))}
                    </div>
               ))}
          </div>

          </div>
     )
};