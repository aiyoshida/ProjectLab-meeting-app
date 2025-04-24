import LeftSidebar from "../components/LeftSidebar";
import NavSetting from '../components/NavSetting';
import MeetingCard from "../components/MeetingCard";
import bin from '../images/bin.svg';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';


const mockData = [
     {
          id: 1,
          date: '2025 Apr 13th',
          title:'Regular meeting',
          creator: 'Ai Yoshida',
          participants:["Katreen", "Tariq"],
          url:'www',
     },
     {
          id: 2,
          date: '2025 Apr 13th',
          title:'Regular meeting',
          creator: 'Ai Yoshida',
          participants:["Katreen", "Tariq", "Ramiz"],
          url:'www',
     },
     {
          id: 3,
          date: '2025 Apr 13th',
          title:'Regular meeting',
          creator: 'Ai Yoshida',
          participants:["Katreen", "Tariq", "Ramiz"],
          url:'www',
     },
     {
          id: 4,
          date: '2025 Apr 13th',
          title:'Regular meeting',
          creator: 'Ai Yoshida',
          participants:["Katreen", "Tariq", "Ramiz"],
          url:'www',
     },
];

function Homepage(){

     return(
          <div>
               <LeftSidebar />

               <div className="meeting-card-container">
               <NavSetting/>
                    <h2 className="title">Meeting List</h2>

                    <div className="meeting-grid">
                         {mockData.map((meeting)=>(
                              <div key={meeting.id} className="meeting-card">
                                   <h3>{meeting.date}</h3>
                                   <p className="meeting-title">{meeting.title}</p>
                                   <p className="meeting-participants">Participants: {meeting.participants.join(", ")}</p>
                                   <button>delete</button>
                              </div>
                         ))}

                    </div>


               </div>

     
          </div>
     );

}

export default Homepage;