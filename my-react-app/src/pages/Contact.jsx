import './Contact.css';
import LeftSidebar from '../components/LeftSidebar';
import NavSetting from '../components/NavSetting';
import MeetingCard from '../components/MeetingCard';
import { useEffect, useState } from "react"
import axios from "axios"



function Contact(){
     const [contacts, setContacts] = useState([])
     const userId = 1 //later takethis id from login info
     useEffect(()=>{
          axios
          .get(`http://localhost:8000/contact/${userId}`)
          .then(response=>{
               setContacts(response.data.contacts)
          })
          .catch(error=>{
               console.error("error: ", error)
          })
     },[])
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
               {contacts.map((contact)=>(
                    <div className="contact-container-contact-row" key={contact.id}>
                         <div className="contact-container-contact-name"> {contact.name}</div>
                         <div className="contact-container-contact-email">{contact.gmail}</div>
                         <button className="contact-container-contact-add">＋</button>
                    </div>
               ))}
               </div>
             </div>
          </div>
     );
}

export default Contact;