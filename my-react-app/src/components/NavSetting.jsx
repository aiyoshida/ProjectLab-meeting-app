import './NavSetting.css';
import setting from '../images/setting.svg';
import { useNavigate } from 'react-router-dom';

export default function NavSetting(){
          const navigate = useNavigate();
          const goToSetting =() =>{
               navigate('/setting');
          }
     
     return(          
               <div className="nav-setting-top-right">
                    <button className="nav-setting-button" onClick={goToSetting}>
                    <img src={setting} alt="setting" className="nav-setting-img"/>
                         Setting
                         </button>
               </div>
     );
}
