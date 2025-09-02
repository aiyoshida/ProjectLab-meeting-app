import React from "react";
import icon from '../images/icon.png';
import { useState, useEffect } from "react"
import axios from "axios"
import moment from "moment-timezone";
const timezones = moment.tz.names(); //list of all timezone with IANA

export default function NewMeetingLeftSideBar({ checkedInvitees = [], setCheckedInvitees, meetingTitle = "", setMeetingTitle, value, onChange }) {
     const [invitees, setInvitees] = useState([]);
     const [timezone, setTimezone] = useState("UTC");

     const storedId = localStorage.getItem('userId');
     const userId = storedId ? parseInt(storedId) : 1;

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
               .catch((err) => {
                    console.error("error: ", err)
               })
     }, [])



     return (
          <div className="items-baseline p-5">

               <div className="flex items-center">
                    <img src={icon} alt='icon' className="w-10 h-10" />
                    <h3 className="">AcrossTime</h3>
               </div>
               {/*title input - mandatory to write*/}
               <div className="flex flex-col my-3">
                    <label className="">Meeting Title *</label>
                    <input type="text" placeholder="Enter meeting title" className="input input-bordered w-56"
                         value={meetingTitle}
                         onChange={(e) => setMeetingTitle(e.target.value)} />
                    {/* <input
                         type="text"
                         className="new-leftsidebar-readonly-box"
                         placeholder="*Enter meeting title"
                         value={meetingTitle}
                         onChange={(e) => setMeetingTitle(e.target.value)} /> */}
               </div>

               {/*timezone - now Budapest only*/}
               <div className="flex flex-col my-4">
                    <label className="">Your Timezone</label>
                    <select className="select select-bordered w-56">
                         <option disabled selected>{timezone}</option>
                         {timezones.map((tz) => (
                              <option key={tz} value={tz}>
                                   {tz}
                              </option>
                         ))}
                    </select>
               </div>

               <div className="flex flex-col my-4">
                    <label className="new-leftsidebar-label">Duration</label>
                    <select className="select select-bordered w-56" value={value} onChange={(e) => onChange(e.target.value)}>
                         <option disabled selected  value="00:30:00">30 min</option>
                         <option value="00:30:00">30min</option>
                         <option value="01:00:00">60min</option>
                         <option value="01:30:00">90min</option>
                    </select>
               </div>


               {/* invite*/}
               <div className="flex flex-col my-4">
                    <label className="">Invite</label>
                    <label className="input input-bordered flex w-56 items-center gap-2 ">
                         <input type="text" className="grow min-w-0" placeholder="Search contact" />
                         <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              className="h-4 w-4 opacity-70 shrink-0 ">
                              <path
                                   fillRule="evenodd"
                                   d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                   clipRule="evenodd" />
                         </svg>
                    </label>
               </div>


               {/* あとでscrollableにする */}
               <div className="ml-2">
                    {invitees.map((user, index) => (
                         <label key={index} className="">
                              <div className="flex items-center mb-4">
                                   <label>
                                        <input type="checkbox" className="checkbox"  checked={checkedInvitees.some(i => i.id === user.id)} onChange={() => handleCheck(user)} />
                                   </label>
                              
                                   <div className="flex items-center gap-3 ml-3 ">
                                                       <div className="avatar">
                                                            <div className="mask mask-squircle h-12 w-12">
                                                                 <img
                                                                      src="https://img.daisyui.com/images/profile/demo/5@94.webp"
                                                                      alt="Avatar Tailwind CSS Component" />
                                                            </div>
                                                       </div>
                                                       <div>
                                                            <div className="font-bold">{user.name}</div>
                                                            <div className="text-sm opacity-50">{user.timezone.split("/").pop()}</div>
                                                       </div>
                                                  </div>
                              </div>


                         </label>
                    ))}
               </div>




          </div>

     );
}
