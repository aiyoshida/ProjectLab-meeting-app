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
                <div>
                  <div className="brand-row">
                    <img src={icon} alt="icon" className="icon"/>
                    <h1 className="brand-name">AcrossTime</h1>
                  </div>
                  <h2>Create an account</h2>
                  <p>Enter your google account to login for this app</p>
                  <button className="google-button">Google</button>
          
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder= "email@domain.com"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <br /><br />
                    <button type="submit">Login</button>
                  </form>
                  </div>
          
              </div>
          
     )
}
