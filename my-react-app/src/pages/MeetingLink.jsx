import './MeetingLink.css';
import { useParams, useLocation } from "react-router-dom"; 
// useParams is to tamle element from url, uselocation is to pass data
//uselocation is for temporary, will use db soon.
import NewMeetingCalendar from '../components/NewMeetingCalendar';



export default function MeetingLink(){

     return(
          <div className="meeting-link-section">
               <NewMeetingCalendar/>
          </div>
     );
}