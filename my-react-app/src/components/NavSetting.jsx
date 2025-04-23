import './NavSetting.css';
import setting from '../images/setting.svg';
import { useNavigate } from 'react-router-dom';

export default function NavSetting(){
          const navigate = useNavigate();
          const goToSetting =() =>{
               navigate('/setting');
          }
     
     return(          
               <div className="top-right">
                    <img src={setting} alt="setting" className="setting"/>
                    <button onClick={goToSetting}>Setting</button>
               </div>
     );
}
