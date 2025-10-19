import {createContext, useContext, useState, useEffect} from 'react';
//This is a box for global value
//here, putting userId and setUserId
const UserContext = createContext();

//manage userId by useState
export const UserProvider = ({children}) => {
     const [userId, setUserId] = useState(null);
//
     useEffect(()=>{
          //localStorage only has string
          //keep userId after reloading
          const storedId =localStorage.getItem('userId');
          if (storedId){
               setUserId(parseInt(storedId));
          }
     }, []); // empty [] = only first time

     return (
          //wrap whole app so userId and setUserId can be accessed from everywhere.
          <UserContext.Provider value={{userId, setUserId}}>
               {children}
          </UserContext.Provider>
     );
};

//custom hook to get userId by const { userId, setUserId } = useUser()
export const useUser = () => useContext(UserContext);