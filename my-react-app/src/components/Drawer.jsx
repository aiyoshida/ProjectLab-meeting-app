// import React from "react";


// export default function Drawer(){

// return(

// <div className="drawer drawer-end">
//   <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
//   <div className="drawer-content">
//     {/* Page content here */}
//     <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">Open drawer</label>
//   </div>
//   <div className="drawer-side">
//     <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
//     <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">

//       {/* Sidebar content here */}
//       <li><a>Sidebar Item 1</a></li>
//       <li><a>Sidebar Item 2</a></li>
//     </ul>
//   </div>
// </div>
// )

// }

// src/components/Drawer.jsx
import React from "react";
import FileUpload from '../components/FileUpload';

export default function Drawer() {
     return (
          <div className="drawer drawer-end">
               {/* toggle 用の隠しチェックボックス */}
               <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

               {/* ページ本体（トリガー含む） */}
               <div className="drawer-content flex justify-start ml-52 mt-10">
                    <label
                         htmlFor="my-drawer-4"
                         className="drawer-button btn flex items-center gap-2 w-40"
                    >
                         <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                         >
                              <path
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   strokeWidth={2}
                                   d="M12 4v16m8-8H4"
                              />
                         </svg>
                         Add Contact
                    </label>
               </div>

               {/* ドロワー側 */}
               <div className="drawer-side">
                    <label
                         htmlFor="my-drawer-4"
                         aria-label="close sidebar"
                         className="drawer-overlay  bg-base-200"
                    ></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-96 p-4">


                         {/* <label className="input input-bordered flex items-center gap-2">
                              <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   viewBox="0 0 16 16"
                                   fill="currentColor"
                                   className="h-4 w-4 opacity-70">
                                   <path
                                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                              </svg>
                              <input type="text" className="grow" placeholder="Username" />
                         </label>


                         <label className="input input-bordered flex items-center gap-2">
                              <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   viewBox="0 0 16 16"
                                   fill="currentColor"
                                   className="h-4 w-4 opacity-70">
                                   <path
                                        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                   <path
                                        d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                              </svg>
                              <input type="text" className="grow" placeholder="Email" />
                         </label>





                         <label className="input input-bordered flex items-center gap-2">
                              <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   viewBox="0 0 24 24"
                                   fill="currentColor"
                                   className="h-4 w-4 opacity-70"
                              >
                                   <path
                                        fillRule="evenodd"
                                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75
       9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 1.5a8.25 8.25 0 0 1 7.482 4.875h-3.517
       a12.294 12.294 0 0 0-2.3-3.94A8.235 8.235 0 0 1 12 3.75zm-2.165.435A10.797 10.797 0 0 1 12
       7.5c.695 0 1.374.072 2.03.21A10.797 10.797 0 0 1 14.165 4.185 8.25 8.25 0 0 1 19.5 12c0
       1.64-.49 3.162-1.335 4.44a10.782 10.782 0 0 1-3.325-4.74A12.268 12.268 0 0 0 12 10.5c-.695
       0-1.374.072-2.03.21a10.782 10.782 0 0 1-3.325-4.74A8.25 8.25 0 0 1 12 3.75c-.737 0-1.455.099-2.165.285zM12
       20.25a8.235 8.235 0 0 1-4.665-1.685A12.294 12.294 0 0 0 10.5 15.75c.658.138 1.336.21 2.03.21.695
       0 1.374-.072 2.03-.21a12.294 12.294 0 0 0 3.165 2.815A8.235 8.235 0 0 1 12 20.25z"
                                        clipRule="evenodd"
                                   />
                              </svg>

                              <input type="text" className="grow" value="select timezone" />
                         </label>
                         <button className="btn">Button</button> */}


                         <div class="relative flex flex-col rounded-xl bg-transparent">
                              <h4 class="block text-xl font-medium text-slate-800">
                                   New friend
                              </h4>




                              <p class="text-slate-500 font-light">
                                   Enter your friend's detail and add to contact
                              </p>




                              <form class="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                                   <div class="mb-1 flex flex-col gap-6">
                                        <div class="w-full max-w-sm min-w-[200px]">
                                             <label class="block mb-2 text-sm text-slate-600">
                                                  Name
                                             </label>
                                             <input type="text" class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Name" />
                                        </div>




                                        <div class="w-full max-w-sm min-w-[200px]">
                                             <label class="block mb-2 text-sm text-slate-600">
                                                  Email
                                             </label>
                                             <input type="email" class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Email" />
                                        </div>


                                        <div class="w-full max-w-sm min-w-[200px]">
                                             <label class="block mb-2 text-sm text-slate-600">
                                                  Timezone
                                             </label>
                                             <input type="password" class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Select timezone" />
                                        </div>
                                   </div>




                                   <div class="inline-flex items-center mt-2">
                                        <label class="flex items-center cursor-pointer relative" for="check-2">

                                             <span class="absolute text-white opacity-0 pointer-events-none peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                                       <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                  </svg>
                                             </span>
                                        </label>

                                   </div>

                                   <label class="block mb-2 text-sm text-slate-600">
                                        Profile picture
                                   </label>
                                   <FileUpload onFile={(file) => console.log("got file:", file)} />


                                   <button class="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                                        Add
                                   </button>




                              </form>
                         </div>
                    </ul>


               </div>
          </div>
     );
}
