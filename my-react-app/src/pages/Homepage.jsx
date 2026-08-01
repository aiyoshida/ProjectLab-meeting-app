import LeftSidebar from "../components/LeftSidebar";
import bin from '../images/bin.svg';
import time from '../images/time.svg';
import no from '../images/no.svg';
import calendar from '../images/calendar.svg';
import check from '../images/check.svg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../lib/api";

function durationInMinutes(duration) {
     const [hours, minutes] = duration.split(':').map(Number);
     return (hours * 60) + minutes;
}

function Homepage() {
     const [cards, setCards] = useState([]);
     const userId = localStorage.getItem('userId');
     const navigate = useNavigate();

     const handleDelete = async (cardId) => {
          try {
               await axios.delete(`${API}/homepage/${cardId}`);
               setCards(previous => previous.filter(card => card.id !== cardId));
          } catch (error) {
               console.error("Failed to delete meeting", error);
          }
     };

     useEffect(() => {
          axios
               .get(`${API}/homepage/${userId}`)
               .then((response) => setCards(response.data.cards))
               .catch((error) => console.error("Failed to load meetings", error));
     }, [userId]);

     return (
          <div className="app-shell">
               <LeftSidebar />

               <main className="app-main">
                    <header className="mb-8">
                         <h1 className="page-heading">Meeting List</h1>
                         <p className="page-subtitle">Your upcoming meeting polls and their voting status.</p>
                    </header>

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                         {cards.map((meeting) => (
                              <section key={meeting.id} className="surface-card group overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-[#dcbfc8] hover:shadow-[0_18px_45px_rgba(89,55,65,0.1)]">
                                   <div onClick={() => navigate(`/meetinglink/${meeting.id}`)} className="cursor-pointer p-5 sm:p-6">
                                        <div className="flex items-start justify-between gap-4">
                                             <div className="min-w-0">
                                                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a94765]">Meeting poll</p>
                                                  <h3 className="mt-1.5 truncate text-xl font-semibold tracking-[-0.02em] text-[#30282b] group-hover:text-[#913c57]">{meeting.title}</h3>
                                                  <p className="mt-1.5 text-sm text-[#776b70]">Created by <span className="font-medium text-[#4b3f43]">{meeting.creator}</span></p>
                                             </div>
                                             <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${meeting.all_voted ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                                                  <span className={`h-2 w-2 rounded-full ${meeting.all_voted ? "bg-emerald-500" : "bg-amber-400"}`} />
                                                  {meeting.all_voted ? "Complete" : "In progress"}
                                             </span>
                                        </div>

                                        <div className="mt-6">
                                             <p className="text-xs font-medium text-[#94878c]">Participants</p>
                                             <div className="meeting-avatar-group avatar-group -space-x-3 rtl:space-x-reverse mt-2">
                                                  {meeting.pictures.map((picture, index) => (
                                                       <div className="avatar" key={`${meeting.id}-${index}`}>
                                                            <div className="w-10 rounded-full border-2 border-white ring-1 ring-[#eadde1]">
                                                                 <img src={picture} alt="Participant" />
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>
                                   </div>

                                   <div className="flex flex-wrap items-center gap-2 border-t border-[#f0e7e9] bg-[#fdfafb] px-5 py-3.5 sm:px-6">
                                        <div className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#5f4d53] ring-1 ring-[#eee4e7]">
                                             <img src={calendar} alt="" className="h-4 w-4 opacity-70" />
                                             <span>{meeting.date}</span>
                                        </div>
                                        <div className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#5f4d53] ring-1 ring-[#eee4e7]">
                                             <img src={time} alt="" className="h-4 w-4 opacity-70" />
                                             <span>{durationInMinutes(meeting.slot_duration)} min</span>
                                        </div>
                                        <div className="ml-auto flex items-center gap-2">
                                             <img src={meeting.all_voted ? check : no} alt="" className="h-4 w-4 opacity-70" />
                                             <span className="hidden text-xs font-medium text-[#776b70] sm:inline">{meeting.all_voted ? "Everyone voted" : "Waiting for votes"}</span>
                                             <button className="icon-button ml-1" onClick={() => handleDelete(meeting.id)} aria-label="Delete meeting">
                                                  <img src={bin} alt="" className="h-5 w-5 opacity-70" />
                                             </button>
                                        </div>
                                   </div>
                              </section>
                         ))}
                    </div>
               </main>
          </div>
     );
}

export default Homepage;
