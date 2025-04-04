import './Setting.css';
import icon from '../images/icon.png';


export default function Setting() {
     return (
          <div>
               <div className="brand-row">
                    <div className="settings-header">
                         <img src={icon} alt="icon" className="icon" />
                         <h1 className="settings-brand">AcrossTime</h1>
                         <button className="settings-close">✕</button>
                    </div>

                    <form className="settings-form">
                         <label className="settings-label">
                              User name
                              <input type="text" placeholder="Your name" className="settings-input" />
                         </label>

                         <label className="settings-label">
                              Time Zone
                              <select className="settings-select">
                                   <option>Choose your timezone</option>
                              </select>
                         </label>

                         <button type="submit" className="settings-button">Change</button>
                    </form>
               </div>

          </div>
     );
}

