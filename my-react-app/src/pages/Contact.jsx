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
               <LeftSidebar/>
               
             <div className="contact-container">
             <NavSetting/>

               <h2 className="contact-container-title">Contact</h2>
               <input className="contact-container-search" placeholder="search contact"/>

               {/*mapを使って、mockdataにある情報を書き出す。*/}
               {/*将来的に、データベースに繋げて、+を追加済みかそうでないかで*/}
               {/*gmailが存在するかのsearchはどうしたらいいんだろうか？*/}
               {/*⭐️ やること:あとで名前とemailの始まりを揃える*/}
               <div className="contact-container-contact-background">
               {mockData.map((contact)=>(
                    <div className="contact-container-contact-row" key={contact.id}>
                         <div className="contact-container-contact-name"> {contact.name}</div>
                         <div className="contact-container-contact-email">{contact.email}</div>
                         <button className="contact-container-contact-add">＋</button>
                    </div>
               ))}
               </div>

             </div>

          </div>
     );
}

export default Contact;