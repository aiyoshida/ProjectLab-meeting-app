import './LeftSidebar.css';
import icon from '../images/icon.png';
import plus from '../images/plus.svg'
import home from '../images/home.svg'
import contact from '../images/contact.svg'


export default function LeftSidebar() {
     return(
               <div className="left-sidebar">
                    <div className="brand-row">
                         <img src={icon} alt='icon' className="icon"/>
                         <h3 className="brand">AcrossTime</h3>
                    </div>
               
                    <div className="menu">
                         <div className = "menu-item">
                              <img src={plus} alt="plus" className="menu-icon"/>
                              <span>Create</span>
                         </div>
                         <div className = "menu-item">
                              <img src={home} alt="plus" className="menu-icon"/>
                              <span>Home</span>
                         </div>
                         <div className = "menu-item">
                              <img src={contact} alt="plus" className="menu-icon"/>
                              <span>Contact</span>
                         </div>
                    </div>
               </div>
      
     );
}
