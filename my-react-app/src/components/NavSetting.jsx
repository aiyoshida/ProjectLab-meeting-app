import './NavSetting.css';
import setting from '../images/setting.svg'


export default function NavSetting(){
     return(          
               <div className="top-right">
                    <img src={setting} alt="setting" className="setting"/>
                    <label>Setting</label>
               </div>
     );
}
