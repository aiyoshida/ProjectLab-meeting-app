import './MeetingCard.css';
import bin from '../images/bin.svg';

export default function MeetingCard(){
     return(
          <div className="card">
               <p>2025 Apr 13th</p>
               <p>Internship Meeting</p>
               <p>participants</p>
               <p>created by Ai Yoshida</p>
               <p>created at 2025 Apr 1st</p>
               <img src={bin} alt="bin" className="bin" />

          </div>

     );
}