import { useParams } from "react-router-dom";
// useParams is to tamle element from url, uselocation is to pass data
//uselocation is for temporary, will use db soon.
import icon from '../images/icon.png';
import watch from '../images/watch.svg';
import timezone_icon from '../images/timezone_icon.svg';
import good from '../images/good.svg';
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { DateTime } from "luxon";
import { API } from "../lib/api" //using this accesable by Render


export default function FinalizeMeeting() {
     const userId = localStorage.getItem('userId');
     const { meetingId } = useParams();
     const [participants, setParticipants] = useState([]);
     const [creator, setCreator] = useState({ sub: "", gmail: "", picture: '', name: '', timezone: '', });
     const [slotDuration, setSlotDuration] = useState("00:30:00");
     const [selectedSlots, setSelectedSlots] = useState(null);
     const [availableSlots, setAvailableSlots] = useState([]);
     const [timezone, setTimezone] = useState("UTC");
     const navigate = useNavigate();
     const goToHomePage = () => {
          navigate('/homepage');
     }


     const handleSubmit = async () => {
          if (selectedSlots == null) {
               alert("Please select one timeslot.");
               return;
          }
          try {
               console.log("FinalizedMeeting.jsx, selectedSlot ", selectedSlots
               );
               await axios.post(`${API}/finalizemeeting/${meetingId}/vote`, { finalized_vote_id: selectedSlots });
               alert("Vote submitted!");
               navigate('/homepage');
          } catch (error) {
               console.error("Error submitting vote", error.response
               );
               alert("Failed to submit vote");
          }
     };

     //get main user's timezone
     useEffect(() => {
          console.log(userId);
          if (!userId)
               alert("There is no userId available!");
          console.log("initial timezone: ", timezone);
          axios.get(`${API}/meetinglink/timezone/${userId}`).then(res => {
               setTimezone(res.data.timezone);
               console.log("Received timezone: ", res.data.timezone);
          })
               .catch(err => {
                    console.error("Failed to get user's timezone", err);
               });

     }, [userId]);

     //get participants' info and available slots
     useEffect(() => {
          if (!meetingId) return;
          console.log(timezone);
          axios
               .get(`${API}/meetinglink/${meetingId}`)
               .then((res) => {
                    setParticipants(res.data.contacts || []);
                    setAvailableSlots(res.data.available_slots || []);
                    setSlotDuration(res.data.slotDuration);
                    setCreator(res.data.creator);
                    console.log("received creator", res.data.creator)
                    console.log("received participants: ", res.data.contacts);
                    console.log("available slots: ", res.data.available_slots);
                    console.log("slot_duration:", res.data.slotDuration);
               })
               .catch((err) => {
                    console.error("Failed to load meeting data", err);
                    setParticipants([]);
                    setAvailableSlots([]);
                    setCreator([]);
               });
     }, [meetingId]);


     return (
          <div className="min-h-screen bg-[#fbf7f8]">
               <div>

                    <div className="brand-lockup cursor-pointer px-8 pt-6" onClick={goToHomePage}>
                         <img src={icon} alt='' className="h-12 w-12" />
                         <h3 className="text-xl">AcrossTime</h3>
                    </div>

                    <div className="surface-card mx-auto mt-8 flex max-w-4xl flex-col gap-10 p-8 md:flex-row md:items-start">

                         <div className="flex flex-col mr-12">
                              <div className="flex justify-start items-center " >
                                   {/* watch icon took from this website 
                              https://icon-rainbow.com/%e6%99%82%e8%a8%88%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3%e7%b4%a0%e6%9d%90-6/ */}
                                   <img src={watch} alt='watch' className="h-5 w-5" />
                                   <p className="ml-2">{Number(slotDuration.split(':')[0]) * 60 + Number(slotDuration.split(':')[1])} min</p>
                              </div>

                              <div className="flex justify-start items-center my-2" >
                                   {/* timezone icon took from this website 
                         https://icon-rainbow.com/%e4%b8%96%e7%95%8c%e5%9c%b0%e5%9b%b3%e3%81%ae%e3%83%95%e3%83%aa%e3%83%bc%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3-1/ */}
                                   <img src={timezone_icon} alt='timezone_icon' className="h-5 w-5" />
                                   <p className="ml-2">{timezone}</p>
                              </div>

                              <div className="flex flex-col my-4 ">
                                   <label className="text-lg">Created By</label>
                              </div>

                              <div className="flex items-center mb-4">
                                   {/* <label>
                                                  <input type="checkbox" className="checkbox" checked={checkedInvitees.some(i => i.id === user.id)} onChange={() => handleCheck(user)} />
                                             </label> */}

                                   <div className="flex items-center gap-3 ml-3 ">
                                        <div className="avatar">
                                             <div className="mask mask-squircle h-12 w-12">
                                                  <img
                                                       src={creator.picture}
                                                       alt="Avatar Tailwind CSS Component" />
                                             </div>
                                        </div>
                                        <div>
                                             <div className="font-bold">{creator.name}</div>
                                             <div className="text-sm opacity-50">{creator.timezone.split("/").pop()}</div>
                                        </div>
                                   </div>
                              </div>


                              <div className="flex flex-col my-4 ">
                                   <label className="text-lg">Voted?</label>
                              </div>

                              <div className="ml-2">
                                   {participants.map((user, index) => (
                                        <label key={index} className="">
                                             <div className="flex items-center mb-4">
                                                  <label>
                                                       <input type="checkbox" className="checkbox" checked={user.voted} />
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

                         <div className="flex min-w-0 flex-1 flex-col">
                              <label className="text-lg my-3" >Vote dates</label>

                              <div className="space-y-1">
                                   {availableSlots.map((date) => {
                                        const d = DateTime.fromISO(date.start, { zone: "utc" }).setZone(timezone);
                                        return (
                                             <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#eee4e7] p-3" key={date.id}>
                                                  {d.toFormat("ccc, LLLL d")}
                                                  {/* https://v4.daisyui.com/components/badge/ # Badge in a button jsx */}
                                                  <div className={`flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm font-semibold ${selectedSlots === date.id ? "bg-[#a94765] text-white ring-4 ring-[#f4dce3]" : "border border-[#dfcbd1] bg-white text-[#5f4d53] hover:bg-[#fff4f7]"}`}
                                                       onClick={() => {
                                                            setSelectedSlots(date.id);
                                                            console.log("FinalizeMeeting.jsx: selected slot:", date.id);
                                                       }}>
                                                       {d.toFormat("H:mm")}
                                                       <div className="badge badge-sm bg-transparent border-none">
                                                            {/* Took good icon from here
                                                       https://icon-rainbow.com/%e3%81%84%e3%81%84%e3%81%ad%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3%e7%b4%a0%e6%9d%90-1/  */}
                                                            <img src={good} alt='good' className="h-5 w-5" />
                                                       </div>

                                                       <div>
                                                            <p>{date.vote_count}</p>
                                                       </div>
                                                  </div>
                                             </div>
                                        );
                                   })}
                              </div>
                         </div>
                    </div>
               </div>


               <div className="mx-auto flex max-w-4xl justify-end py-5">
                    <button onClick={handleSubmit} className="primary-button">Finalize meeting</button>
               </div>
          </div>
     );
}

