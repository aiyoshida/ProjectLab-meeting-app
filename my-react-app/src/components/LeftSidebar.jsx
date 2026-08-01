//import './LeftSidebar.css';
import icon from '../images/icon.png';
import plus from '../images/plus.svg'
import home from '../images/home.svg'
import contact from '../images/contact.svg'
import account from '../images/account.svg'
import logout from '../images/logout.svg'
import setting from '../images/setting.svg'
import { useLocation, useNavigate } from 'react-router-dom';

export default function LeftSidebar() {
     const navigate = useNavigate();
     const location = useLocation();
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

     const handleLogout = () => {
          localStorage.removeItem('userId');
          localStorage.removeItem('googleIdToken');
          navigate('/register');
     };

     return (

          <aside className="sticky top-0 z-20 flex h-auto w-full shrink-0 flex-col border-b border-[#eadde1] bg-white md:h-screen md:w-[17rem] md:border-b-0 md:border-r">
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

               <div className="flex h-full flex-col">
                    <div className="px-3 py-3 md:px-5 md:py-7">
                         <button className="brand-lockup px-2" onClick={goToHomePage}>
                              <img src={icon} alt='' className="h-9 w-9 md:h-11 md:w-11" />
                              <span className="text-base md:text-lg">AcrossTime</span>
                         </button>

                         <ul className="mt-3 flex items-center gap-1 overflow-x-auto pb-1 md:mt-8 md:block md:space-y-1.5 md:overflow-visible md:pb-0">
                              <li>
                                   <button
                                        className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold md:w-full md:gap-3 md:px-4 md:py-3 ${location.pathname === '/newmeeting' ? 'bg-[#f8e6eb] text-[#913c57]' : 'text-[#776b70] hover:bg-[#faf5f6] hover:text-[#4b3f43]'}`}
                                        onClick={goToNewMeeting}
                                   >
                                        <img src={plus} alt="plus" className="w-4 h-4" />
                                        Create
                                   </button>
                              </li>

                              <li>
                                   <button
                                        className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold md:w-full md:gap-3 md:px-4 md:py-3 ${location.pathname === '/homepage' ? 'bg-[#f8e6eb] text-[#913c57]' : 'text-[#776b70] hover:bg-[#faf5f6] hover:text-[#4b3f43]'}`}
                                        onClick={goToHomePage}
                                   >
                                        <img src={home} alt="home" className="w-4 h-4" />
                                        Home
                                   </button>
                              </li>

                              <li>
                                   <button
                                        className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold md:w-full md:gap-3 md:px-4 md:py-3 ${location.pathname === '/contact' ? 'bg-[#f8e6eb] text-[#913c57]' : 'text-[#776b70] hover:bg-[#faf5f6] hover:text-[#4b3f43]'}`}

                                        onClick={goToContact}
                                   >
                                        <img src={contact} alt="contact" className="w-4 h-4" />
                                        Contact
                                   </button>
                              </li>

                              <li>

                                   <details className="group [&_summary::-webkit-details-marker]:hidden">

                                        <summary
                                             className="flex min-w-max cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[#776b70] hover:bg-[#faf5f6] hover:text-[#4b3f43] md:w-full md:px-4 md:py-3"
                                        >

                                             <span className="flex items-center gap-2 text-base font-medium">
                                                  <img src={account} alt="account" className="w-4 h-4" />
                                                  Account </span>


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

                                        <ul className="absolute right-3 mt-2 min-w-40 space-y-1 rounded-xl border border-[#eadde1] bg-white p-2 shadow-lg md:static md:min-w-0 md:border-0 md:p-0 md:px-4 md:shadow-none">
                                             <li>
                                                  <button
                                                       className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#776b70] hover:bg-[#faf5f6] hover:text-[#4b3f43]"
                                                       onClick={goToSettingPage}
                                                  >
                                                       <img src={setting} alt="setting" className="w-4 h-4" />
                                                       Setting
                                                  </button>
                                             </li>

                                             <li>
                                                  <button
                                                       className="flex items-center gap-3 w-full rounded-xl px-4 py-2.5 [text-align:_inherit] text-sm font-semibold text-[#776b70] hover:bg-[#faf5f6] hover:text-[#4b3f43]"
                                                       onClick={handleLogout}
                                                  >
                                                       <img src={logout} alt="logout" className="w-4 h-4" />
                                                       Logout
                                                  </button>
                                             </li>
                                        </ul>
                                   </details>
                              </li>
                         </ul>
                    </div>

               </div>
          </aside>

     );
}
