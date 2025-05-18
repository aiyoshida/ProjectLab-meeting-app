import './Register.css';
import icon from '../images/icon.png';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register(){
     const [name, setName] = useState('');
     const [timezone, setTimezone] = useState('');
     const [gmail, setGmail] = useState('');

    const navigate = useNavigate();
     const goToHomePage = () => {
          navigate('/homepage');
     }

    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, gmail, timezone }),
    });

    const data = await response.json();
    localStorage.setItem('userId', data.userId);
    navigate('/homepage');
  } catch (error) {
    console.error(error);
    alert('Registration failed');
  }
};

    
      
     return(
          <div>
                <div className="register-all">
                  <div className="register-brand-row">
                    <img src={icon} alt="icon" className="register-icon"/>
                    <h1 className="register-brand-name">AcrossTime</h1>
                  </div>
                  <h2>Create an account</h2>
                  <p>Enter your user name, timezone, and gmail to login for this app</p>
          
                  <form onSubmit={handleSubmit}>
                    <input 
                      className = "register-username"
                      type="text"
                      placeholder = "User name"
                      value = {name}
                      onChange={(e)=>setName(e.target.value)}
                    />
                    <br /><br />
                    <input
                      className="register-timezone"
                      type="text"
                      placeholder= "Timezone"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    />
                    <br /><br />
                    <input
                      className="register-email"
                      type="text"
                      placeholder= "  email@domain.com"
                      value={gmail}
                      onChange={(e) => setGmail(e.target.value)}
                    />
                    <br /><br />
                    <button className="register-login" type="submit">Login</button>
                  </form>
                </div>
          
          </div>
          
     )
}
