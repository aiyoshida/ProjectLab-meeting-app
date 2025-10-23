import React from "react";
import icon from '../images/icon.png';
import { useState, useEffect } from "react"
import axios from "axios"
import moment from "moment-timezone";
import { useNavigate } from 'react-router-dom';
import { API } from "../lib/api" //using this accesable by Render

const timezones = moment.tz.names(); //list of all timezone with IANA


export default function NewMeetingLeftSideBar({ checkedInvitees = [], setCheckedInvitees, meetingTitle = "", setMeetingTitle, value, onChange }) {
     const [invitees, setInvitees] = useState([]);
     const [timezone, setTimezone] = useState("UTC");
     //userId stored in the local storage. Saved in the login time.
     const userId = localStorage.getItem('userId');
     const navigate = useNavigate();
     const goToHomePage = () => {
          navigate('/homepage');
     }


     const handleCheck = (invitee) => {
          const alreadyChecked = checkedInvitees.some(i => i.id === invitee.id)
          if (alreadyChecked) {
               //uncheck
               setCheckedInvitees(checkedInvitees.filter(i => i.id !== invitee.id))
          } else {
               if (checkedInvitees.length < 3) {
                    setCheckedInvitees([...checkedInvitees, invitee])
               }
               else {
                    alert("It is only up to 3 people")
               }
          }
     }
     //get checked invitees
     useEffect(() => {
          console.log("checkedInvitees:", checkedInvitees)
     }, [checkedInvitees])

     //get contacts
     useEffect(() => {
          async function fetchContact() {
               try {
                    console.log("user_id: ", userId);
                    const res = await axios.get(`${API}/newmeeting/${userId}`);
                    setInvitees(res.data.contacts);
                    console.log("GET contact list: ", res.data.contacts)

               } catch (err) {
                    console.error("error: ", err);
               }
          }
          fetchContact();
     }, [])

     //get userId's timezone
     useEffect(() => {
          async function fetchTimezone() {
               try {
                    const res = await axios.get(`${API}/newmeeting/timezone/${userId}`);
                    setTimezone(res.data.timezone);
                    console.log(res.data.timezone);
               } catch (err) {
                    console.error("useEffect timezone! error happened: ", err);
               }
          }
          fetchTimezone();
     }, [])



     return (
          <div className="items-baseline p-5">

               <div className="flex items-center hover:cursor-pointer " onClick={goToHomePage} >
                    <img src={icon} alt='icon' className="w-10 h-10" />
                    <h3 className="">AcrossTime</h3>
               </div>
               {/*title input - mandatory to write*/}
               <div className="flex flex-col my-3">
                    <label className="">Meeting Title *</label>
                    <input type="text" placeholder="Enter meeting title" className="input input-bordered w-56"
                         value={meetingTitle}
                         onChange={(e) => setMeetingTitle(e.target.value)} />
               </div>

               {/* timezone */}
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
                         <option disabled selected value="00:30:00">30 min</option>
                         <option value="00:30:00">30min</option>
                         <option value="01:00:00">60min</option>
                         <option value="01:30:00">90min</option>
                    </select>
               </div>


               {/* invite*/}
               <div className="flex flex-col my-4 ">
                    <label className="">Invite</label>
               </div>


               {/* あとでscrollableにする */}
               <div className="ml-2">
                    {invitees.map((user, index) => (
                         <label key={index} className="">
                              <div className="flex items-center mb-4">
                                   <label>
                                        <input type="checkbox" className="checkbox" checked={checkedInvitees.some(i => i.id === user.id)} onChange={() => handleCheck(user)} />
                                   </label>

                                   <div className="flex items-center gap-3 ml-3 ">
                                        <div className="avatar">
                                             <div className="mask mask-squircle h-12 w-12">
                                                  <img
                                                       src={user.picture}
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
