import './LeftSidebar.css';
import icon from '../images/icon.png';
import plus from '../images/plus.svg'
import home from '../images/home.svg'
import contact from '../images/contact.svg'
import { useNavigate } from 'react-router-dom';

export default function LeftSidebar() {
     const navigate = useNavigate();
     const goToContact =()=>{
          navigate('/contact');
     }
     const goToNewMeeting=()=>{
          navigate('/newmeeting');
     }
     const goToHomePage=()=>{
          navigate('/homepage');
      }
     

     return(
               <div className="left-sidebar">
                    <div className="leftside-brand-row">
                         <img src={icon} alt='icon' className="leftside-icon"/>
                         <h3 className="leftside-brand">AcrossTime</h3>
                    </div>
               
                    <div className="menu">
                         <div className = "menu-item">
                         <button className="select-button" onClick={goToNewMeeting}>
                              <img src={plus} alt="plus" className="menu-icon"/>
                              Create</button>
                         </div>

                         <div className = "menu-item">
                         <button className="select-button" onClick={goToHomePage}>
                              <img src={home} alt="plus" className="menu-icon"/>
                              Home</button>
                         </div>

                         <div className = "menu-item">

                         <button className="select-button" onClick={goToContact}>
                              <img src={contact} alt="plus" className="menu-icon"/>
                              Contact

                              </button>
                         </div>
                    </div>
               </div>
      
     );
}
