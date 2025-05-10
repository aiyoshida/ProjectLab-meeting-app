import LeftSidebar from "../components/LeftSidebar";
import NavSetting from '../components/NavSetting';
import MeetingCard from "../components/MeetingCard";
import bin from '../images/bin.svg';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
import axios from "axios"


function Homepage() {
     const [cards, setCards] = useState([])
     //temporary
     const userId = 1
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
     },[])
     return (
          <div>
               <LeftSidebar />
               <div className="meeting-card-container">
                    <NavSetting />
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
               </div>
          </div>
     );


}
export default Homepage;