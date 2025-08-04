import LeftSidebar from "../components/LeftSidebar";
import MeetingCard from "../components/MeetingCard";
import bin from '../images/bin.svg';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
import axios from "axios"


function Homepage() {
     const [cards, setCards] = useState([])
     const storedId = localStorage.getItem('userId');
     const userId = storedId ? parseInt(storedId) : null;
     const handleDelete = async (cardId) => {
          try {
               await axios.delete(`http://localhost:8000/homepage/${cardId}`)
               setCards(prev => prev.filter(card => card.id !== cardId))
          } catch (err) {
               console.error("error", err)
          }
     }


     useEffect(() => {
          axios
               .get(`http://localhost:8000/homepage/${userId}`)
               .then((res) => {
                    setCards(res.data.cards)
               })
               .catch((err) => {
                    console.error("fetch error", err)
               })
     }, [])

     return (
          <div className="min-h-dvh grid grid-cols-[18rem_1fr]">
               <LeftSidebar />
               {/* <div className="meeting-card-container">
                    <h2 className="title">Meeting List</h2>

                    <div className="meeting-grid">
                         {cards.map((meeting) => (
                              <div key={meeting.id} className="meeting-card">
                                   <h3>{meeting.created_at}</h3>
                                   <p className="meeting-title">{meeting.title}</p>
                                   <p className="meeting-participants">Participants: {meeting.participants.join(", ")}</p>
                                   <p className="meeting-url">{meeting.url}</p>
                                   <button onClick={() => handleDelete(meeting.id)}>delete</button>
                              </div>
                         ))}

                    </div>
               </div> */}

               <main className="min-h-dvh bg-[#f6e5e7] p-8">
                    {/* コンテンツ幅・中央寄せ */}
                    <section className="max-w-3xl mx-auto">
                         {/* 見出し */}
                         <h1 className="text-left text-xl font-semibold text-gray-700">
                              Meeting List
                         </h1>

<a href="#" className="block rounded-md border border-gray-300 p-4 shadow-sm sm:p-6">
  <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
    <div className="sm:order-last sm:shrink-0">
     
    </div>

    <div className="mt-4 sm:mt-0">
      <h3 className="text-lg font-medium text-pretty text-gray-900">
        How I built my first website with Nuxt, Tailwind CSS and Vercel
      </h3>

      <p className="mt-1 text-sm text-gray-700">By John Doe</p>

      <p className="mt-4 line-clamp-2 text-sm text-pretty text-gray-700">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. At velit illum provident a, ipsa
        maiores deleniti consectetur nobis et eaque.
      </p>
    </div>
  </div>

  <dl className="mt-6 flex gap-4 lg:gap-6">
    <div className="flex items-center gap-2">
      <dt className="text-gray-700">
        <span className="sr-only"> Published on </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg>
      </dt>

      <dd className="text-xs text-gray-700">31/06/2025</dd>
    </div>

    <div className="flex items-center gap-2">
      <dt className="text-gray-700">
        <span className="sr-only"> Reading time </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
      </dt>

      <dd className="text-xs text-gray-700">12 minutes</dd>
    </div>
    
  </dl>
</a>

                         {/*ここは後で自動で4つ以上になったら次のページに行くし、ボタンの自動生成も必要。 */}
                         <div className="join mt-8 ">
                              <button className="join-item btn btn-active">1</button>
                              <button className="join-item btn ">2</button>
                              <button className="join-item btn">3</button>
                              <button className="join-item btn">4</button>
                         </div>
                    </section>



               </main>



          </div>
     );


}
export default Homepage;