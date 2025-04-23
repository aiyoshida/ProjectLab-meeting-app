import LeftSidebar from "../components/LeftSidebar";
import NavSetting from '../components/NavSetting';
import MeetingCard from "../components/MeetingCard";
import './Homepage.css';
import { useNavigate } from 'react-router-dom';

function Homepage(){

     return(
          <div>
               <LeftSidebar />
               <NavSetting/>

               <div className="contact">
               <h2>Meeting List</h2>
               <div className="card-grid">
                    <MeetingCard/>
                    <MeetingCard/>
                    <MeetingCard/>
                    <MeetingCard/>
               </div>
               </div>

     
          </div>
     );

}

export default Homepage;