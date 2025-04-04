import './Contact.css';
import LeftSidebar from '../components/LeftSidebar';
import setting from '../images/setting.svg'
import {useState} from 'react';


function Contact(){
     return(
          <div>
               <LeftSidebar/>

               <div>
               <img src={setting} alt="setting" className="setting"/>
               <label>Setting</label>
               </div>


          </div>
     );
}

export default Contact;