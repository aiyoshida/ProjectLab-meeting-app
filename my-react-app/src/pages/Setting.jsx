
import icon from '../images/icon.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import axios from "axios";
import moment from "moment-timezone";

export default function Setting() {
     const navigate = useNavigate();
     const goToHomePage = () => {
          navigate('/homepage');
     }
     const [username, setUsername] = useState("No user name")
     const [timezone, setTimezone] = useState("UTC")
     const timezones = moment.tz.names(); //list of all timezone with IANA
     const [gmail, setGmail] = useState("example@gmail.com");
     const storedId = localStorage.getItem('userId');
     const userId = storedId ? parseInt(storedId) : 1;

     useEffect(() => {
          if (!userId) return;
          const fetchUserData = async () => {
               try {
                    const response = await axios.get(`http://localhost:8000/setting/${userId}`);
                    const data = response.data;
                    console.log(response);

                    setUsername(data.username);
                    setTimezone(data.timezone);
                    setGmail(data.gmail);
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
               await axios.put(`http://localhost:8000/setting/${userId}`, {
                    id: userId,
                    username: username,
                    timezone: timezone,
                    gmail: "example@gmail.com"
               }, {
                    headers: {
                         "Content-Type": "application/json"
                    }
               })


               console.log("Sending data：", {
                    id: userId,
                    username,
                    timezone,
                    gmail: "example@gmail.com"
               })

               goToHomePage()
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


               <div className="my-8 space-y-1">
                    <div>userId: {userId}</div>
                    <div>user name: {username}</div>
                    <div>timezone: {timezone}</div>
                    <div>gmail: {gmail}</div>
               </div>


               <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
                    {/* <label className="settings-label">
                              User name
                              <input type="text" placeholder="Your name" className="settings-input" value={username} onChange={(e) => setUsername(e.target.value)} />
                         </label> */}

                    <label htmlFor="Username" className = "justify-start">
                         <span className="text-sm font-medium text-gray-700 mx-2"> User name </span>

                         <input
                              type="username"
                              id="Username"
                              className="mt-0.5 w-60 rounded border-gray-300 shadow-sm sm:text-sm border"
                         />
                    </label>

                    {/*will implement all of timezone by using "moment-timezone" library in the future*/}
                    {/* <label className="settings-label">
                              Time Zone
                              <select className="settings-select" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                                   <option>Choose your timezone</option>
                                   {timezones.map((tz)=>(
                                        <option key={tz} value={tz}>
                                             {tz}
                                   </option>
                                   ))}

                              </select>
                         </label> */}
                    <label htmlFor="Timezone" className="flex">
                         <span className="text-sm font-medium text-gray-700"> Time zone </span>
                         <select className="select select-bordered w-full max-w-xs">
                              <option disabled selected>Choose your timezone</option>
                              {timezones.map((tz) => (
                                   <option key={tz} value={tz}>
                                        {tz}
                                   </option>
                              ))}
                         </select>
                    </label>

                    <button className="btn m-2">Change</button>
               </form>


          </div>
     );
}

