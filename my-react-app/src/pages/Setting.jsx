
import icon from '../images/icon.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import axios from "axios";
import moment from "moment-timezone";
import { API } from "../lib/api" //using this accesable by Render


export default function Setting() {
     const navigate = useNavigate();
     const goToHomePage = () => {
          navigate('/homepage');
     }
     const [username, setUsername] = useState("No user name");
     const [timezone, setTimezone] = useState("UTC");
     const timezones = moment.tz.names(); //list of all timezone with IANA. not available with Luxon.
     const [gmail, setGmail] = useState("example@gmail.com");
     const [picture, setPicture] = useState(null);
     const [saved, setSaved] = useState(false);
     //take userId from local storage
     const userId = localStorage.getItem('userId');
     // //if not null = storedId, if null = 1.
     // const userId = storedId ? parseInt(storedId) : 1;

     useEffect(() => {
          // get user info from DB using userId in the local storage.
          if (!userId) return;
          const fetchUserData = async () => {
               try {
                    console.log("This is userId stored in the local storage: ", userId);
                    const response = await axios.get(`${API}/setting/${userId}`);
                    const data = response.data;
                    console.log("This is response from DB: ", response);

                    setUsername(data.username);
                    setTimezone(data.timezone);
                    setGmail(data.gmail);
                    setPicture(data.picture);
                    console.log("timezone: ", timezone);
               } catch (err) {
                    console.error("failed to load user data", err);
               }

          };
          fetchUserData();

     }, [userId]);

     // arrow func, so async locates here.
     const handleSubmit = async (e) => {
          //stop default reload
          e.preventDefault()

          try {
               const res = await axios.put(`${API}/setting/${userId}`, {
                    username: username,
                    timezone: timezone,
               },)
               console.log(res);
               setSaved(true);

               console.log("Sending data：", {
                    id: userId,
                    username,
                    timezone,
               })
          } catch (err) {
               console.error("error", err)
          }


     }

     return (
          <div className="min-h-screen bg-[#fbf7f8] px-5 py-8">
               <div className="mx-auto flex max-w-2xl items-center justify-between">
                    <div className="brand-lockup">
                         <img src={icon} alt="" className="w-11 h-11" />
                         <h1 className="text-lg">AcrossTime</h1>
                    </div>
                    <button className="secondary-button h-10 w-10 px-0" onClick={goToHomePage} aria-label="Close settings">
                         <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   strokeWidth="2"
                                   d="M6 18L18 6M6 6l12 12" />
                         </svg>
                    </button>
               </div>

               {/*tailwind template referemce: https://v4.daisyui.com/components/avatar/ */}
               <div className="surface-card mx-auto mt-8 max-w-2xl p-7 sm:p-10">
                    <div className="mb-8 flex flex-col items-center border-b border-[#eee4e7] pb-8 text-center">
                    <div className="avatar">
                         <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                              <img src={picture} alt={`${username} avatar`} />
                         </div>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">{username}</h2>
                    <p className="mt-1 text-sm text-[#776b70]">{gmail}</p>
                    <p className="mt-1 max-w-full truncate text-xs text-[#a3989c]">User ID: {userId}</p>
               </div>


               <form className="space-y-5" onSubmit={handleSubmit}>
                    <label htmlFor="Timezone" className="block">
                         <span className="field-label">Time zone</span>
                         <select className="app-field" value={timezone} onChange={e => { setTimezone(e.target.value); setSaved(false); }}>
                              <option disabled selected>Choose your timezone</option>
                              {timezones.map((tz) => (
                                   <option key={tz} value={tz}>
                                        {tz}
                                   </option>
                              ))}
                         </select>
                    </label>

                    <div className="flex items-center justify-end gap-4">
                         {saved && <span className="text-sm font-medium text-emerald-700">Saved</span>}
                         <button type="submit" className="primary-button">Save changes</button>
                    </div>
               </form>

               </div>
          </div>
     );
}
