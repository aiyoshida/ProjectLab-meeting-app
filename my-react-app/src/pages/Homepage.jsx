import LeftSidebar from "../components/LeftSidebar";
import MeetingCard from "../components/MeetingCard";
import bin from '../images/bin.svg';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
import axios from "axios"


function Homepage() {
     const [cards, setCards] = useState([])
     const storedId = localStorage.getItem('userId');
     const userId = storedId ? parseInt(storedId) : null;
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
               //仮にここを1とする。後で変える。
               .get(`http://localhost:8000/homepage/${1}`)
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
               {/* <div className="meeting-card-container">
                    <h2 className="title">Meeting List</h2>

                    <div className="meeting-grid">
                         {cards.map((meeting) => (
                              <div key={meeting.id} className="meeting-card">
                                   <h3>{meeting.created_at}</h3>
                                   <p className="meeting-title">{meeting.title}</p>
                                   <p className="meeting-participants">Participants: {meeting.participants.join(", ")}</p>
                                   <p className="meeting-url">{meeting.url}</p>
                                   <button onClick={() => handleDelete(meeting.id)}>delete</button>
                              </div>
                         ))}

                    </div>
               </div> */}

               <main className="min-h-dvh bg-[#f6e5e7] p-8">
                    <section className="max-w-3xl mx-auto">
                         <h1 className="text-left text-xl font-semibold text-gray-700 p-8">
                              Meeting List
                         </h1>

                         <a href="#" className="block rounded-md border border-gray-300 bg-white p-4 shadow-sm sm:p-6 w-96 rounded-10">
                              <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                                   <div className="mt-4 sm:mt-0">
                                        <h3 className="text-lg font-medium text-pretty text-gray-900">
                                             Thesis consulting meeting
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-700">Created By Ai Yoshida</p>

                                        <p className="mt-4 line-clamp-2 text-sm text-pretty text-gray-700">Participants :</p>
                                   </div>
                              </div>

                              <dl className="mt-6 flex gap-4 lg:gap-6">
                                   <div className="flex items-center gap-2">
                                        <dd className="text-xs text-gray-700">Date : 31/06/2025</dd>
                                   </div>

                                   <div className="flex items-center gap-2">
                                        <dt className="text-gray-700">
                                        </dt>

                                        <dd className="text-xs text-gray-700">30 minutes</dd>
                                   </div>

                                    <img src={bin} alt="bin" className="w-4 h-4"/>

                              </dl>

                              
                         </a>

                         {/*ここは後で自動で4つ以上になったら次のページに行くし、ボタンの自動生成も必要。 */}
                         <div className="flex join mt-8 justify-center ">
                              <button className="join-item btn btn-active">1</button>
                              <button className="join-item btn ">2</button>
                              <button className="join-item btn">3</button>
                              <button className="join-item btn">4</button>
                         </div>
                    </section>



               </main>



          </div>
     );


}
export default Homepage;