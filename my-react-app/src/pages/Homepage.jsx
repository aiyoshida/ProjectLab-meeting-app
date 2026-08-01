import LeftSidebar from "../components/LeftSidebar";
import bin from '../images/bin.svg';
import time from '../images/time.svg';
import no from '../images/no.svg';
import calendar from '../images/calendar.svg';
import check from '../images/check.svg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
import axios from "axios"
import { API } from "../lib/api" //using this accesable by Render


//TODO: 
// 1) meeting tableに、display booleanを足す
// 2) discardのボタンでは、displayを0にする
// 3) display 1の時のみhomepageに出すようにする。 

function Homepage() {
     const [cards, setCards] = useState([])
     const userId = localStorage.getItem('userId');
     const navigate = useNavigate();

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
                    console.log("Hoepage.jsx The cards!!!: : ", res.data.cards);
               })
               .catch((err) => {
                    console.error("fetch error", err)
               })
     }, [])

     return (
          <div className="app-shell">
               <LeftSidebar />

               <main className="app-main">
                    <header className="mb-8">
                         <h1 className="page-heading">Meeting List</h1>
                         <p className="page-subtitle">Your upcoming meeting polls and their voting status.</p>
                    </header>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                         {cards.map((meeting) => (
                              <section key={meeting.id} className="surface-card group p-6">
                                   <div>
                                        <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                                             {/* navigate to voting screen by click */}
                                             <div onClick={() => navigate(`/meetinglink/${meeting.id}`)} className="cursor-pointer">
                                                  <h3 className="text-xl font-semibold text-pretty text-[#30282b] group-hover:text-[#913c57]">{meeting.title}</h3>
                                                  <p className="mt-2 text-sm text-gray-700">Created By : {meeting.creator}</p>
                                                  {/*https://v4.daisyui.com/components/avatar/    avatar-group*/}
                                                  {/* <p className="mt-2 line-clamp-2 text-sm text-pretty text-gray-700">Participants : {meeting.participants}</p> */}
                                                  {/* Participants */}
                                                  <div className="mt-2">
                                                       <p className="text-sm text-gray-700 font-medium">Participants:</p>

                                                       <div className="avatar-group -space-x-6 rtl:space-x-reverse mt-1">
                                                            {meeting.pictures.map((pic, index) => (
                                                                 <div className="avatar" key={`${meeting.id}-${index}`}>
                                                                      <div className="w-10 rounded-full border">
                                                                           <img src={pic} alt="Participant" />
                                                                      </div>
                                                                 </div>
                                                            ))}
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>

                                        <dl className="mt-6 flex flex-wrap items-center gap-5 border-t border-[#f0e7e9] pt-4">

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
                                                  <img src={meeting.all_voted ? check : no} alt={meeting.all_voted ? "check" : "no"} className="w-5 h-5" />
                                                  <dd className="text-xs text-gray-700">Everyone voted?</dd>
                                             </div>


                                             {/* bin */}
                                             <button className="icon-button ml-auto" onClick={() => { handleDelete(meeting.id) }} aria-label="Delete meeting">
                                                  <img src={bin} alt="" className="w-5 h-5" />
                                             </button>
                                        </dl>
                                   </div>
                              </section>
                         ))}
                    </div>
               </main>
          </div>
     );
}
export default Homepage;
