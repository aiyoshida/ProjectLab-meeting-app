import './Register.css';
import icon from '../images/icon.png';
import {useState} from 'react';

export default function Register(){
     const [name, setName] = useState('');
     const handleSubmit = (e) => {
          e.preventDefault();
          console.log('登録名:', name);
          alert(`登録しました：${name}`);
        };
      
     return(
          <div>
                <div className="register-all">
                  <div className="register-brand-row">
                    <img src={icon} alt="icon" className="register-icon"/>
                    <h1 className="register-brand-name">AcrossTime</h1>
                  </div>
                  <h2>Create an account</h2>
                  <p>Enter your google account to login for this app</p>
                  <button className="register-google-button">Google</button>
                  <p>-------------------------or login--------------------------</p>
          
                  <form onSubmit={handleSubmit}>
                    <input
                      className="register-email"
                      type="text"
                      placeholder= "email@domain.com"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <br /><br />
                    <button className="register-login" type="submit">Login</button>
                  </form>
                </div>
          
          </div>
          
     )
}
