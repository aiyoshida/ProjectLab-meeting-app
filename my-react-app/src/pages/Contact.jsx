import LeftSidebar from '../components/LeftSidebar';
import { useEffect, useState } from "react"
import axios from "axios"
import plus from '../images/plus.svg';
import bin from '../images/bin.svg';
import search from '../images/search.svg';
import { DateTime } from "luxon";
import { API } from "../lib/api" //using this accesable by Render


function Contact() {
     const [contacts, setContacts] = useState([]);
     const userId = localStorage.getItem('userId');
     const [timezone, setTimezone] = useState("UTC");
     const [searchEmail, setSearchEmail] = useState("");
     const [friendInfo, setFriendInfo] = useState({
          sub: "0",
          username: "Tariq!!",
          gmail: "example@com",
          timezone: "Jordan",
          picture: "https://img.daisyui.com/images/profile/demo/2@94.webp"
     });

     //decides display contact search result or not
     const [showResult, setShowResult] = useState(false);
     //decides display modal
     const [showModal, setShowModal] = useState(false);

     function timeDifference(userLocation, friendLocation){
          const d = DateTime.now(); 
          console.log("Contact.jsx: userLocation", userLocation);
          console.log("Contact.jsx: friendLocation", friendLocation);
          const offsetUser = d.setZone(userLocation).offset;   
          const offsetFriend = d.setZone(friendLocation).offset;      
          const diffHours = (offsetFriend - offsetUser) / 60; 
          console.log("Contact.jsx: timeDifference", diffHours);
          return diffHours; 
     }


     useEffect(() => {
          // in the useEffect, to define HTTP req, either .then or define func with axios.
          axios
               .get(`${API}/contact/${userId}`)
               .then(response => {
                    console.log("contacts: ", response.data.contacts);
                    setContacts(response.data.contacts);
                    setTimezone(response.data.timezone)
                    console.log("user_id: ", userId);
               })
               .catch(error => {
                    console.error("error: ", error)
               })
     }, [userId])

     //finding new friend contact from DB by email
     const handleSearch = async (e) => {
          //stopping JS default reload to utelize React function
          e.preventDefault();

          if (!searchEmail)
               return;
          try {
               console.log("This is email to process: ", { searchEmail });
               const res = await axios.get(`${API}/contact/search/${searchEmail}`);
               if (res.data.sub == null) {
                    console.log("Email has searched in the user table but no result");
                    setShowModal(true);
                    return;
               }
               console.log("This is data", res.data);
               setFriendInfo({
                    sub: res.data.sub,
                    username: res.data.username,
                    gmail: res.data.gmail,
                    timezone: res.data.timezone,
                    picture: res.data.picture
               });
          } catch (err) {
               console.error("Error happend during search email", err);
               console.error(err.response.status);
          }
          setShowResult(true);
     }
     // TODO: needs reload to reflect change now
     const handleAdd = async (e) => {
          try {
               console.log("This is friend info to add:", friendInfo);
               const res = await axios.post(`${API}/contact/add/${userId}`,
                    {
                         sub: friendInfo.sub
                    }
               );
          } catch (err) {
               console.error("This is error: ", err);
          }
          setShowResult(false);
     }
     // official Axios document :
     // https://axios-http.com/docs/api_intro 
     // for axios.delete, data should be explicitly written
     // axios.delete(url, config)
     // TODO: needs reload to reflect change now
     const handleDelete = async (contact) => {
          try {
               console.log("contact:", contact);
               const res = await axios.delete(`${API}/contact/delete/${userId}`,
                    { data: { sub: contact.sub } }
               );
          } catch (err) {
               console.error("This is error: ", err);
          }
     }


     return (

          <div className="min-h-dvh grid grid-cols-[18rem_1fr]">
               <LeftSidebar />
               <main className="min-h-dvh bg-[#f6e5e7] p-2">
                    <div className="flex items-center">
                         <h1 className="text-left text-2xl font-semibold text-gray-700 p-10 ml-11">
                              Contact
                         </h1>

                         <label className="input input-bordered flex items-center gap-2 w-64">
                              <input type="text" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} className="grow" placeholder="Search new contact by gmail" />

                         </label>

                         {/* search button: https://v4.daisyui.com/components/button/ */}
                         <button className="btn btn-square btn-outline ml-3" onClick={handleSearch}>
                              <img src={search} alt="search" className="w-5 h-5" />
                         </button>
                    </div>
               {/*Tailwind template: https://v4.daisyui.com/components/modal/ "Dialog modal with a close button at corner" jsx with some modification. */}
                    {showModal && 
               <dialog id="my_modal_3" className="modal modal-top" open>
                    <div className="modal-box">
                         <form method="dialog">
                              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=>setShowModal(false)}>✕</button>
                         </form>
                         <h3 className="font-bold text-lg">No result in this app ;(</h3>
                         <p className="py-4">The email you searched in not registered in this app. Pls ask your friend to join!</p>
                    </div>
               </dialog>
               }

                    {/* contact search */}
                    {/*maybe better to on/off with dom, not css...? */}
                    <table className={` fixed top-24 left-300px ml-52 bg-white rounded-md z-50 ${showResult ? "block" : "hidden"}`}>
                         <tbody >
                              <tr>
                                   <td className="p-1.5">
                                        <div className="flex items-center gap-3">
                                             <div className="avatar">
                                                  <div className="mask mask-squircle h-12 w-12">
                                                       <img
                                                            src={friendInfo.picture}
                                                            alt="Avatar Tailwind CSS Component" />
                                                  </div>
                                             </div>
                                             <div>
                                                  <div className="font-bold ">{friendInfo.username}</div>
                                                  <div className="text-sm opacity-50">{friendInfo.timezone}</div>
                                             </div>
                                        </div>
                                   </td>

                                   <td className="pl-5">
                                        {friendInfo.gmail}
                                        <br />
                                   </td>

                                   <td className="pl-5">{timeDifference(timezone, friendInfo.timezone)}h</td>
                                   <th>
                                        {/*add button: https://icon-rainbow.com/?s=%E5%8F%8B%E9%81%94*/}
                                        <button
                                             onClick={handleAdd}
                                             className="p-1 hover:rounded"
                                        >
                                             <img src={plus} alt="plus" className="w-6 h-6 ml-5 mr-5" />
                                        </button>

                                   </th>
                              </tr>
                         </tbody>
                    </table>

                    {/*contact table*/}
                    <section className="max-w-2xl mx-auto">
                         <div className="overflow-x-auto">
                              <table className="table">
                                   {/* head */}
                                   <thead>
                                        <tr>

                                             <th>Name</th>
                                             <th>Email</th>
                                             <th>Time difference</th>
                                             <th></th>
                                        </tr>
                                   </thead>

                                   <tbody>
                                        {contacts.map((contact) => (
                                             <tr key={contact.id}>
                                                  <td>
                                                       <div className="flex items-center gap-3">
                                                            <div className="avatar">
                                                                 <div className="mask mask-squircle h-12 w-12">
                                                                      <img
                                                                           src={contact.picture || null}
                                                                           alt={`${contact.name} avatar`}
                                                                      />
                                                                 </div>
                                                            </div>
                                                            <div>
                                                                 <div className="font-bold">{contact.name}</div>
                                                                 <div className="text-sm opacity-50">{contact.timezone.split("/").pop()}</div>
                                                            </div>
                                                       </div>
                                                  </td>
                                                  <td>{contact.gmail}</td>
                                                  <td>{timeDifference(timezone, contact.timezone)}h</td>
                                                  <td>

                                                       <button
                                                            onClick={() => handleDelete(contact)}
                                                            className="p-1 hover:rounded"
                                                       >
                                                            <img src={bin} alt="bin" className="w-5 h-5" />
                                                       </button>
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                                  

                              </table>
                         </div>
                    </section>




               </main>


          </div >








          // <div>
          //      <LeftSidebar/>

          //    <div className="contact-container">
          //    <NavSetting/>

          //      <h2 className="contact-container-title">Contact</h2>
          //      <input className="contact-container-search" placeholder="search contact"/>

          //      {/*mapを使って、mockdataにある情報を書き出す。*/}
          //      {/*将来的に、データベースに繋げて、+を追加済みかそうでないかで*/}
          //      {/*gmailが存在するかのsearchはどうしたらいいんだろうか？*/}
          //      {/*⭐️ やること:あとで名前とemailの始まりを揃える*/}
          //      <div className="contact-container-contact-background">
          //      {contacts.map((contact)=>(
          //           <div className="contact-container-contact-row" key={contact.id}>
          //                <div className="contact-container-contact-name"> {contact.name}</div>
          //                <div className="contact-container-contact-email">{contact.gmail}</div>
          //                <button className="contact-container-contact-add">＋</button>
          //           </div>
          //      ))}
          //      </div>
          //    </div>
          // </div>
     );
}

export default Contact;