import LeftSidebar from "../components/LeftSidebar";
import MeetingCard from "../components/MeetingCard";
import bin from '../images/bin.svg';
import time from '../images/time.svg';
import calendar from '../images/calendar.svg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
import axios from "axios"


function Homepage() {
     const [cards, setCards] = useState([])
     const userId = localStorage.getItem('userId');//これなんだっけ？
     const handleDelete = async (cardId) => {
          try {
               await axios.delete(`http://localhost:8000/homepage/${cardId}`)
               setCards(prev => prev.filter(card => card.id !== cardId))
          } catch (err) {
               console.error("error", err)
          }
     }


     useEffect(() => {
          axios
               .get(`http://localhost:8000/homepage/${userId}`)
               .then((res) => {
                    setCards(res.data.cards)
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

                    

                    {/* <div class="grid grid-cols-2 ml-20">
                         {cards.map((meeting) => (
                         <section key={meeting.id} className="max-w-3xl mb-10">
                              <a href="#" className="block rounded-md border border-gray-300 bg-white shadow-sm sm:p-6 w-96">
                                   <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                                        <div className="mt-4 sm:mt-0">
                                             <h3 className="text-lg font-medium text-pretty text-gray-900">{meeting.title}</h3>
                                             <p className="mt-1 text-sm text-gray-700">Created By {meeting.creator}</p>
                                             <p className="mt-4 line-clamp-2 text-sm text-pretty text-gray-700">Participants :{meeting.participants}</p>
                                        </div>
                                   </div>

                                   <dl className="mt-6 flex gap-4 lg:gap-6">
                                        <div className="flex items-center gap-1">
                                             <img src={calendar} alt="calendar" className="w-4 h-4" />
                                             <dd className="text-xs text-gray-700">Date : 31/06/2025</dd>
                                        </div>
                                        <div className="flex items-center gap-1">
                                             <img src={time} alt="time" className="w-4 h-4" />
                                             <dd className="text-xs text-gray-700">30 minutes</dd>
                                        </div>
                                        <img src={bin} alt="bin" className="w-5 h-5" />
                                   </dl>
                              </a>
                         </section>

                        

                    ))}

                        

                    </div> */}




               </main>



          </div>
     );


}
export default Homepage;