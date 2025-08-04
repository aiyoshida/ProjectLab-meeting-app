//import './LeftSidebar.css';
import icon from '../images/icon.png';
import plus from '../images/plus.svg'
import home from '../images/home.svg'
import contact from '../images/contact.svg'
import { useNavigate } from 'react-router-dom';

export default function LeftSidebar() {
     const navigate = useNavigate();
     const goToContact = () => {
          navigate('/contact');
     }
     const goToNewMeeting = () => {
          navigate('/newmeeting');
     }
     const goToHomePage = () => {
          navigate('/homepage');
     }
          const goToSettingPage = () => {
          navigate('/setting');
     }


     return (
          <div className="left-sidebar">
               {/* <div className="leftside-brand-row">
                         <img src={icon} alt='icon' className="leftside-icon"/>
                         <h3 className="leftside-brand">AcrossTime</h3>
                    </div>
               
                    <div className="menu">
                         <div className = "menu-item">
                         <button className="select-button" onClick={goToNewMeeting}>
                              <img src={plus} alt="plus" className="menu-icon"/>
                              Create</button>
                         </div>

                         <div className = "menu-item">
                         <button className="select-button" onClick={goToHomePage}>
                              <img src={home} alt="plus" className="menu-icon"/>
                              Home</button>
                         </div>

                         <div className = "menu-item">

                         <button className="select-button" onClick={goToContact}>
                              <img src={contact} alt="plus" className="menu-icon"/>
                              Contact

                              </button>
                         </div>
                    </div> */}

               <div className="flex h-screen flex-col justify-between border-e border-gray-100 bg-white">
                    <div className="px-4 py-6">
                         <span className="grid h-10 w-32 place-content-center rounded-lg  text-xs text-gray-600">
                              <img src={icon} alt='icon' className="w-16 h-16" />
                         </span>

                         <ul className="mt-6 space-y-1">
                              <li>
                                   <a
                                        href="#"
                                        className="flex items-center gap-2  rounded-lg  px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                        onClick={goToNewMeeting}
                                   >
                                         <img src={plus} alt="plus" className="w-4 h-4"/>
                                        Create
                                   </a>
                              </li>

                              <li>
                                   <a
                                        href="#"
                                        className="flex  gap-2 block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                        onClick={goToHomePage}
                                   >
                                        <img src={home} alt="home" className="w-4 h-4"/>
                                        Home
                                   </a>
                              </li>

                              <li>
                                   <a
                                        href="#"
                                        className="flex gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                        
                                        onClick={goToContact}
                                   >
                                        <img src={contact} alt="contact" className="w-4 h-4"/>
                                        Contact
                                   </a>
                              </li>

                              <li>
                                   <details className="group [&_summary::-webkit-details-marker]:hidden">
                                        <summary
                                             className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                        >
                                             <span className="text-sm font-medium"> Account </span>

                                             <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                                  <svg
                                                       xmlns="http://www.w3.org/2000/svg"
                                                       className="size-5"
                                                       viewBox="0 0 20 20"
                                                       fill="currentColor"
                                                  >
                                                       <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                       />
                                                  </svg>
                                             </span>
                                        </summary>

                                        <ul className="mt-2 space-y-1 px-4">
                                             <li>
                                                  <a
                                                       href="#"
                                                       className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                       onClick={goToSettingPage}
                                                  >
                                                       Setting
                                                  </a>
                                             </li>

                                             <li>
                                                  <a
                                                       href="#"
                                                       className="w-full rounded-lg px-4 py-2 [text-align:_inherit] text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                  >
                                                       Logout
                                                  </a>
                                             </li>
                                        </ul>
                                   </details>
                              </li>
                         </ul>
                    </div>

               </div>
          </div>

     );
}
