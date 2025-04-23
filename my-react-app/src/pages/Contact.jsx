import './Contact.css';
import LeftSidebar from '../components/LeftSidebar';
import NavSetting from '../components/NavSetting';
import MeetingCard from '../components/MeetingCard';
import {useState} from 'react';


const mockData =[
     {id:1, name:'Katreen', email:'example1@gmail.com'},
     {id:2, name:'Tariq', email:'example2@gmail.com'},
     {id:3, name:'Ramiz', email:'example3@gmail.com'},
];

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