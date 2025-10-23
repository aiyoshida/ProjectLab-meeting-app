import LeftSidebar from "../components/LeftSidebar";
import MeetingCard from "../components/MeetingCard";
import bin from '../images/bin.svg';
import time from '../images/time.svg';
import no from '../images/no.svg';
import calendar from '../images/calendar.svg';
import check from '../images/check.svg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
import axios from "axios"
import { API } from "../lib/api" //using this accesable by Render

function Homepage() {
     const [cards, setCards] = useState([])
     const userId = localStorage.getItem('userId');
     const navigate = useNavigate();
     const goToMeetingPage = () => {
          navigate('/homepage');
     }


     const handleDelete = async (cardId) => {
          try {
               await axios.delete(`${API}/homepage/${cardId}`)
               setCards(prev => prev.filter(card => card.id !== cardId))
          } catch (err) {
               console.error("error", err)
          }
     }


     useEffect(() => {
          axios
               .get(`${API}/homepage/${userId}`)
               .then((res) => {
                    setCards(res.data.cards)
                    console.log("The cards!!!: ", res.data.cards);
               })
               .catch((err) => {
                    console.error("fetch error", err)
               })
     }, [])

     return (
          <div className="min-h-dvh grid grid-cols-[18rem_1fr]">
               <LeftSidebar />

               <main className="min-h-dvh bg-[#f6e5e7] p-10 ">
                    <h1 className="text-left text-2xl font-semibold text-gray-700 p-10 ml-11 ">
                         Meeting List
                    </h1>

                    <div class="grid grid-cols-2 ml-20">
                         {cards.map((meeting) => (
                              <section key={meeting.id} className="max-w-3xl mb-10">
                                   <a className="block rounded-md border border-gray-300 bg-white shadow-sm sm:p-6 w-96">
                                        <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                                             {/* navigate to voting screen by click */}
                                             <div onClick={() => navigate(`/meetinglink/${meeting.id}`)} className="mt-4 sm:mt-0 hover:cursor-pointer">
                                                  <h3 className="text-xl font-medium text-pretty text-gray-900">{meeting.title}</h3>
                                                  <p className="mt-2 text-sm text-gray-700">Created By : {meeting.creator}</p>
                                                  <p className="mt-2 line-clamp-2 text-sm text-pretty text-gray-700">Participants : {meeting.participants}</p>
                                             </div>
                                        </div>

                                        <dl className="mt-5 flex gap-4 lg:gap-6 items-center">
                                             
                                             <div className="flex flex-col">
                                             {/*  Date */}
                                             <div className="flex items-center gap-2">
                                                  <img src={calendar} alt="calendar" className="w-4 h-4" />
                                                  <dd className="text-xs text-gray-700">{meeting.date}</dd>
                                             </div>
                                             {/* Time */}
                                             <div className="flex items-center gap-2 mt-2">
                                                  <img src={time} alt="time" className="w-4 h-4" />
                                                  <dd className="text-xs text-gray-700">{meeting.slot_duration} min</dd>
                                             </div>
                                             </div>

                                             {/* voted? */}
                                             <div className="flex items-center gap-2 mt-2">
                                                  {/* icon of check
                                                   https://icon-rainbow.com/%e3%82%b7%e3%83%b3%e3%83%97%e3%83%ab%e3%81%aa%e3%83%81%e3%82%a7%e3%83%83%e3%82%af%e3%83%9e%e3%83%bc%e3%82%af%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3-2/ */}
                                                   {/* icon of x
                                                   https://icon-rainbow.com/%e7%a6%81%e6%ad%a2%e3%80%81%e9%96%89%e3%81%98%e3%82%8b%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3%e7%b4%a0%e6%9d%90-3/ */}
                                                   <img src={meeting.all_voted ? check: no} alt={meeting.all_voted ? "check": "no"} className="w-5 h-5" />
                                                  <dd className="text-xs text-gray-700">Everyone voted?</dd>
                                             </div>


                                             {/* bin */}
                                             <img src={bin} alt="bin" className="w-5 h-5 cursor-pointer hover:bg-gray-300 rounded" onClick={() => { handleDelete(meeting.id) }} />
                                        </dl>
                                   </a>
                              </section>



                         ))}

                    </div>

               </main>
          </div>
     );


}
export default Homepage;