
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
     const timezones = moment.tz.names(); //list of all timezone with IANA
     const [gmail, setGmail] = useState("example@gmail.com");
     const [picture, setPicture] = useState(null);
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
          <div className="flex flex-col items-center p-5">
               <div className="flex items-center gap-5">
                    <img src={icon} alt="icon" className="w-10 h-10" />
                    <h1 className="text-lg">AcrossTime</h1>
                    <button className="btn btn-square btn-outline" onClick={goToHomePage}>
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
               <div className="my-8 space-y-1">
                    <div className="avatar">
                         <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                              <img src={picture} />
                         </div>
                    </div>
                    <div>userId: {userId}</div>
                    <div>user name: {username}</div>
                    <div>timezone: {timezone}</div>
                    <div>gmail: {gmail}</div>
               </div>


               <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
                    <label htmlFor="Timezone" className="flex">
                         <span className="text-sm font-medium text-gray-700"> Time zone </span>
                         <select className="select select-bordered w-full max-w-xs" value={timezone} onChange={e => setTimezone(e.target.value)}>
                              <option disabled selected>Choose your timezone</option>
                              {timezones.map((tz) => (
                                   <option key={tz} value={tz}>
                                        {tz}
                                   </option>
                              ))}
                         </select>
                    </label>

                    <button className="btn m-2" onClick={goToHomePage}>Change</button>
               </form>


          </div>
     );
}

