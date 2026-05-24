import React, {useContext,useState,useEffect} from 'react'
import {createContext} from 'react'
import {authDataContext} from './AuthContextProvider.jsx'
import axios from 'axios'


export const userDataContext = createContext();

export default function UserContext({ children }) {
  const { serverUrl } = useContext(authDataContext);
  const [userData, setUserData] = useState(null);

  const getCurrentUser = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true,
      });
      console.log("API Response: ", result.data);

      if (result.data) {
        setUserData(result.data);
      } else {
        console.log("No User Found");
        setUserData(null);
      }
    } catch (error) {
      console.log("Error in getCurrentUser:", error.response?.data);
      setUserData(null);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const value = {
    userData,
    setUserData,
    getCurrentUser,
  };

  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}
