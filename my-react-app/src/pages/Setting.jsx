import './Setting.css';
import icon from '../images/icon.png';
import { useNavigate } from 'react-router-dom';


export default function Setting() {
     const navigate = useNavigate();
     const goToHomePage =()=>{
          navigate('/homepage');
 }

     return (
          <div>
               <div className="setting-brand-row">
                    <div className="settings-header">
                         <img src={icon} alt="icon" className="icon" />
                         <h1 className="settings-brand">AcrossTime</h1>
                         <button className="settings-close" onClick={goToHomePage}>✕</button>
                    </div>

                    <form className="settings-form">
                         <label className="settings-label">
                              User name
                              <input type="text" placeholder="Your name" className="settings-input" />
                         </label>

                         {/*will implement all of timezone by using "moment-timezone" library in the future*/}
                         <label className="settings-label">
                              Time Zone
                              <select className="settings-select">
                                   <option>Choose your timezone</option>
                                   <option value="Asia/Tokyo">Asia/Tokyo</option>
                                   <option value="Europe/Budapest">Europe/Budapest</option>
                                   <option value="Asia/Amman">Asia/Amman</option>
                                   <option value="Asia/Baku">Asia/Baku</option>
                                   <option value="America/Toronto">America/Toronto</option>
                              </select>
                         </label>

                         <button type="submit" className="settings-button" onClick={goToHomePage}>Change</button>
                    </form>
               </div>

          </div>
     );
}

