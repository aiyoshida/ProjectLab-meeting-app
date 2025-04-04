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
               
                                   <div>
                                   <img src={plus} alt="plus" className="plus"/>
                                   <button type="button">Create</button>
                                   <img src={home} alt="plus" className="plus"/>
                                   <button type="button">Home</button>
                                   <img src={contact} alt="plus" className="plus"/>
                                   <button type="button">Contact</button>
                                   </div>
               </div>

     );
}
