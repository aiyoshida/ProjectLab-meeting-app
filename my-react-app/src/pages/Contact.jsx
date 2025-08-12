import LeftSidebar from '../components/LeftSidebar';
import NavSetting from '../components/NavSetting';
import MeetingCard from '../components/MeetingCard';
import { useEffect, useState } from "react"
import axios from "axios"



function Contact() {
     const [contacts, setContacts] = useState([])
     const storedId = localStorage.getItem('userId');
     const userId = storedId ? parseInt(storedId) : 1;
     useEffect(() => {
          axios
               .get(`http://localhost:8000/contact/${userId}`)
               .then(response => {
                    setContacts(response.data.contacts)
               })
               .catch(error => {
                    console.error("error: ", error)
               })
     }, [])
     return (

          <div className="min-h-dvh grid grid-cols-[18rem_1fr]">
               <LeftSidebar />

               <main className="min-h-dvh bg-[#f6e5e7] p-10">

                    <h1 className="text-left text-2xl font-semibold text-gray-700 p-10 ml-11">
                         Contact
                    </h1>
                    <section className="max-w-3xl mx-auto">
                         <div className="overflow-x-auto">
                              <table className="table">
                                   {/* head */}
                                   <thead>
                                        <tr>
                                             <th>
                                                  <label>
                                                       <input type="checkbox" className="checkbox" />
                                                  </label>
                                             </th>
                                             <th>Name</th>
                                             <th>Job</th>
                                             <th>Favorite Color</th>
                                             <th></th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {/* row 1 */}
                                        <tr>
                                             <th>
                                                  <label>
                                                       <input type="checkbox" className="checkbox" />
                                                  </label>
                                             </th>
                                             <td>
                                                  <div className="flex items-center gap-3">
                                                       <div className="avatar">
                                                            <div className="mask mask-squircle h-12 w-12">
                                                                 <img
                                                                      src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                                                      alt="Avatar Tailwind CSS Component" />
                                                            </div>
                                                       </div>
                                                       <div>
                                                            <div className="font-bold">Hart Hagerty</div>
                                                            <div className="text-sm opacity-50">United States</div>
                                                       </div>
                                                  </div>
                                             </td>
                                             <td>
                                                  Zemlak, Daniel and Leannon
                                                  <br />
                                                  <span className="badge badge-ghost badge-sm">Desktop Support Technician</span>
                                             </td>
                                             <td>Purple</td>
                                             <th>
                                                  <button className="btn btn-ghost btn-xs">details</button>
                                             </th>
                                        </tr>
                                        {/* row 2 */}
                                        <tr>
                                             <th>
                                                  <label>
                                                       <input type="checkbox" className="checkbox" />
                                                  </label>
                                             </th>
                                             <td>
                                                  <div className="flex items-center gap-3">
                                                       <div className="avatar">
                                                            <div className="mask mask-squircle h-12 w-12">
                                                                 <img
                                                                      src="https://img.daisyui.com/images/profile/demo/3@94.webp"
                                                                      alt="Avatar Tailwind CSS Component" />
                                                            </div>
                                                       </div>
                                                       <div>
                                                            <div className="font-bold">Brice Swyre</div>
                                                            <div className="text-sm opacity-50">China</div>
                                                       </div>
                                                  </div>
                                             </td>
                                             <td>
                                                  Carroll Group
                                                  <br />
                                                  <span className="badge badge-ghost badge-sm">Tax Accountant</span>
                                             </td>
                                             <td>Red</td>
                                             <th>
                                                  <button className="btn btn-ghost btn-xs">details</button>
                                             </th>
                                        </tr>
                                        {/* row 3 */}
                                        <tr>
                                             <th>
                                                  <label>
                                                       <input type="checkbox" className="checkbox" />
                                                  </label>
                                             </th>
                                             <td>
                                                  <div className="flex items-center gap-3">
                                                       <div className="avatar">
                                                            <div className="mask mask-squircle h-12 w-12">
                                                                 <img
                                                                      src="https://img.daisyui.com/images/profile/demo/4@94.webp"
                                                                      alt="Avatar Tailwind CSS Component" />
                                                            </div>
                                                       </div>
                                                       <div>
                                                            <div className="font-bold">Marjy Ferencz</div>
                                                            <div className="text-sm opacity-50">Russia</div>
                                                       </div>
                                                  </div>
                                             </td>
                                             <td>
                                                  Rowe-Schoen
                                                  <br />
                                                  <span className="badge badge-ghost badge-sm">Office Assistant I</span>
                                             </td>
                                             <td>Crimson</td>
                                             <th>
                                                  <button className="btn btn-ghost btn-xs">details</button>
                                             </th>
                                        </tr>
                                        {/* row 4 */}
                                        <tr>
                                             <th>
                                                  <label>
                                                       <input type="checkbox" className="checkbox" />
                                                  </label>
                                             </th>
                                             <td>
                                                  <div className="flex items-center gap-3">
                                                       <div className="avatar">
                                                            <div className="mask mask-squircle h-12 w-12">
                                                                 <img
                                                                      src="https://img.daisyui.com/images/profile/demo/5@94.webp"
                                                                      alt="Avatar Tailwind CSS Component" />
                                                            </div>
                                                       </div>
                                                       <div>
                                                            <div className="font-bold">Yancy Tear</div>
                                                            <div className="text-sm opacity-50">Brazil</div>
                                                       </div>
                                                  </div>
                                             </td>
                                             <td>
                                                  Wyman-Ledner
                                                  <br />
                                                  <span className="badge badge-ghost badge-sm">Community Outreach Specialist</span>
                                             </td>
                                             <td>Indigo</td>
                                             <th>
                                                  <button className="btn btn-ghost btn-xs">details</button>
                                             </th>
                                        </tr>
                                   </tbody>
                                   {/* foot */}
                                   <tfoot>
                                        <tr>
                                             <th></th>
                                             <th>Name</th>
                                             <th>Job</th>
                                             <th>Favorite Color</th>
                                             <th></th>
                                        </tr>
                                   </tfoot>
                              </table>
                         </div>
                    </section>

               </main>


          </div>








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