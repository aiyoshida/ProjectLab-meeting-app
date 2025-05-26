import {createContext, useContext, useState, useEffect} from 'react';
const UserContext = createContext();

export const UserProvider = ({children}) => {
     const [userId, setUserId] = useState(null);

     useEffect(()=>{
          //localStorage only has string
          const storedId =localStorage.getItem('userId');
          if (storedId){
               setUserId(parseInt(storedId));
          }
     }, []); // empty [] = only first time

     return (
          <UserContext.Provider value={{userId, setUserId}}>
               {children}
          </UserContext.Provider>
     );
};

//custom hook to get userId by const { userId, setUserId } = useUser()
export const useUser = () => useContext(UserContext);