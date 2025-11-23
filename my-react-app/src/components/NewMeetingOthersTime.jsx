import getBaseTime from '../utils/getBaseTime';
import React from "react";
import { DateTime } from 'luxon';
import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../lib/api" //using this accesable by Render

export default function NewMeetingOthersTime({ checkedInvitees = [] }) {
     const [timezone, setTimezone] = useState("Europe/Budapest"); //meeting poll creator's tz

     //basetime : creator's tz
     const basetime = getBaseTime(timezone);
     const userId = localStorage.getItem('userId');
     console.log("checkedInvitees:", checkedInvitees)

     //get userId's timezone
     useEffect(() => {
          axios
               .get(`${API}/newmeetingother/timezone/${userId}`)
               .then((res) => {
                    setTimezone(res.data.timezone)
                    console.log("NewMeetingOthersTime.jsx : user's tz ", res.data.timezone);
               })
               .catch((err) => {
                    console.error("NewMeetingOthersTime.jsx : error ", err)
               })
     }, [])


     return (
          <div className="w-1/3 max-w-full overflow-x-auto overflow-y-hidden mt-16 pt-0.5 mr-3">
               <table className="min-w-max ml-auto ">
                    <thead className="border rounded-lg">
                         <tr >
                              {/* 左上の空セル（時刻見出し用） */}
                              {checkedInvitees.map((invitee) => (
                                   <th key={invitee.id} scope="col" className="px-5 py-3.5 text-left font-semibold ">
                                        {invitee.timezone.split("/").pop()}
                                   </th>
                              ))}
                         </tr>
                    </thead>

                    <tbody>
                         {basetime.map((slot, i) => (
                              <tr key={i} className="border-t border-white border-[1.7px]">
                                   {checkedInvitees.map((invitee) => {
                                        const hour = slot.setZone(invitee.timezone).hour; 
                                        // color reference from https://www.timeanddate.com/worldclock/meetingtime.html?iso=20251115&p1=11&p2=248
                                        let bgClass = "bg-[#caabb6]"; // red = no
                                        if (hour >= 9 && hour < 19) {
                                             bgClass = "bg-[#81d7bb]"; // blue = good
                                        } else if (hour >= 7 && hour < 22) {
                                             bgClass = "bg-[#d4c89d]"; // yellow = soso
                                        }

                                        return (
                                             <td
                                                  key={invitee.id}
                                                  className={`${bgClass} text-base font-medium text-center align-middle justify-center px-5 py-[13.1px]`}
                                             >
                                                  {slot.setZone(invitee.timezone).toFormat("HH:mm")}
                                             </td>
                                        );
                                   })}
                              </tr>
                         ))}
                    </tbody>

               </table>
          </div>

     )
};