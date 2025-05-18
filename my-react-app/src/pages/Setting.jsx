import './Setting.css';
import icon from '../images/icon.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import axios from "axios"


export default function Setting() {
     const navigate = useNavigate();
     const goToHomePage = () => {
          navigate('/homepage');
     }
     const [username, setUsername] = useState("")
     const [timezone, setTimezone] = useState("")
     const [gmail, setGmail] = useState("");
     const storedId = localStorage.getItem('userId');
     const userId = storedId ? parseInt(storedId) : null;

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
     
     const handleLogout = () => {
          localStorage.removeItem('userId');
          navigate('/register');
     };

     return (
          <div>
               <div className="setting-brand-row">
                    <div className="settings-header">
                         <img src={icon} alt="icon" className="icon" />
                         <h1 className="settings-brand">AcrossTime</h1>
                         <button className="settings-close" onClick={goToHomePage}>✕</button>
                    </div>


                    <div>
                         <div>userId: {userId}</div>
                         <div>user name: {username}</div>
                         <div>timezone: {timezone}</div>
                         <div>gmail: {gmail}</div>
                    </div>

                    <form className="settings-form" onSubmit={handleSubmit}>
                         <label className="settings-label">
                              User name
                              <input type="text" placeholder="Your name" className="settings-input" value={username} onChange={(e) => setUsername(e.target.value)} />
                         </label>

                         {/*will implement all of timezone by using "moment-timezone" library in the future*/}
                         <label className="settings-label">
                              Time Zone
                              <select className="settings-select" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                                   <option>Choose your timezone</option>
                                   <option value="Asia/Tokyo">Asia/Tokyo</option>
                                   <option value="Europe/Budapest">Europe/Budapest</option>
                                   <option value="Asia/Amman">Asia/Amman</option>
                                   <option value="Asia/Baku">Asia/Baku</option>
                                   <option value="America/Toronto">America/Toronto</option>
                              </select>
                         </label>

                         <button type="submit" className="settings-button">Change</button>
                         <button type="button" className="settings-button" onClick={handleLogout}>Log out</button>
                    </form>
               </div>

          </div>
     );
}

