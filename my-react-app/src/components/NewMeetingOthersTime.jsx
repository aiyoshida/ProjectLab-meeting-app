import './NewMeetingOthersTime.css';
import getBaseTime from '../utils/getBaseTime';
import React from "react";
import { DateTime } from 'luxon';


export default function NewMeetingOthersTime() {

     //basetime 
     const basetime = getBaseTime();

     //example data
     const othertimezone = [
          {country:"Jordan", zone:"Asia/Amman"},
          {country:"Japan", zone:"Asia/Tokyo"},
     ];

     return(
          <div className="othertimezone-container">
          <div className="othertimezone-header-row">
               {othertimezone.map((tz) =>(
                    <div key={tz.zone} className="othertimezone-head-item"> {tz.country}</div>
               ))}
          </div>

          <div>
               {basetime.map((slot,idx)=>(
                    <div className="othertimezone-time-row" key={idx}>
                         {othertimezone.map((tz)=>(

                          <div key={tz.zone} className="othertimezone-time-item">
                              {slot.setZone(tz.zone).toFormat("H:mm")}
                         </div>
                         ))}
                    </div>
               ))}
          </div>

          </div>
     )
};