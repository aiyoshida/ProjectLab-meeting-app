import LeftSidebar from '../components/LeftSidebar';
import { useCallback, useEffect, useState } from "react"
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
     const [pendingContactSub, setPendingContactSub] = useState(null);

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


     const loadContacts = useCallback(async () => {
          if (!userId) return;
          const response = await axios.get(`${API}/contact/${userId}`);
          setContacts(response.data.contacts);
          setTimezone(response.data.timezone);
     }, [userId]);

     useEffect(() => {
          loadContacts().catch(error => {
               console.error("Failed to load contacts:", error);
          });
     }, [loadContacts]);

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
     const handleAdd = async () => {
          if (pendingContactSub || contacts.some(contact => contact.sub === friendInfo.sub)) {
               setShowResult(false);
               return;
          }

          const previousContacts = contacts;
          const optimisticContact = {
               id: `pending-${friendInfo.sub}`,
               sub: friendInfo.sub,
               name: friendInfo.username,
               gmail: friendInfo.gmail,
               timezone: friendInfo.timezone,
               picture: friendInfo.picture
          };

          setPendingContactSub(friendInfo.sub);
          setContacts(current => [...current, optimisticContact]
               .sort((a, b) => a.name.localeCompare(b.name)));
          setShowResult(false);
          setSearchEmail("");

          try {
               await axios.post(`${API}/contact/add/${userId}`, { sub: friendInfo.sub });
               await loadContacts();
          } catch (err) {
               setContacts(previousContacts);
               console.error("Failed to add contact:", err);
          } finally {
               setPendingContactSub(null);
          }
     }
     // official Axios document :
     // https://axios-http.com/docs/api_intro 
     // for axios.delete, data should be explicitly written
     // axios.delete(url, config)
     const handleDelete = async (contact) => {
          if (pendingContactSub) return;

          const previousContacts = contacts;
          setPendingContactSub(contact.sub);
          setContacts(current => current.filter(item => item.sub !== contact.sub));

          try {
               await axios.delete(`${API}/contact/delete/${userId}`,
                    { data: { sub: contact.sub } }
               );
               await loadContacts();
          } catch (err) {
               setContacts(previousContacts);
               console.error("Failed to delete contact:", err);
          } finally {
               setPendingContactSub(null);
          }
     }


     return (

          <div className="app-shell">
               <LeftSidebar />
               <main className="app-main">
                    <header className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
                         <div>
                              <h1 className="page-heading">Contacts</h1>
                              <p className="page-subtitle">Find people by Gmail and compare local time at a glance.</p>
                         </div>

                         <form className="relative flex w-full max-w-md gap-2" onSubmit={handleSearch}>
                              <input type="email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} className="app-field pr-12" placeholder="Search by Gmail address" />

                         {/* search button: https://v4.daisyui.com/components/button/ */}
                         <button type="submit" className="icon-button absolute right-0.5 top-0.5" aria-label="Search contacts">
                              <img src={search} alt="" className="w-5 h-5" />
                         </button>
                         </form>
                    </header>
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
                    <table className={`surface-card mb-5 ml-auto w-full max-w-2xl overflow-hidden ${showResult ? "table" : "hidden"}`}>
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
                                             disabled={pendingContactSub !== null}
                                             className="p-1 hover:rounded disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                             <img src={plus} alt="plus" className="w-6 h-6 ml-5 mr-5" />
                                        </button>

                                   </th>
                              </tr>
                         </tbody>
                    </table>

                    {/*contact table*/}
                    <section className="surface-card mx-auto max-w-4xl overflow-hidden">
                         <div className="overflow-x-auto p-2 sm:p-4">
                              <table className="table min-w-[42rem]">
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
                                             <tr key={contact.id} className="hover:bg-[#fff9fa]">
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
                                                            disabled={pendingContactSub !== null}
                                                            className="p-1 hover:rounded disabled:cursor-not-allowed disabled:opacity-40"
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
