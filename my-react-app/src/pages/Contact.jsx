import './Contact.css';
import LeftSidebar from '../components/LeftSidebar';
import NavSetting from '../components/NavSetting';
import MeetingCard from '../components/MeetingCard';
import {useState} from 'react';


function Contact(){
     return(
          <div>
               <NavSetting/>
               <LeftSidebar/>
               
             <div className="contact">
               <h2 className="title">Contact</h2>
               <input className="search" placeholder="search contact"/>

               <div className="contact-row">
                    <div className="contact-avatar">K</div>
                    <div className="contact-name">Katreen</div>
                    <div className="contact-email">example.com</div>
                    <button className="contact-add">＋</button>
               </div>

             </div>

          </div>
     );
}

export default Contact;