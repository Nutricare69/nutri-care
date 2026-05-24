import React, { createContext, useState } from "react";
export const authDataContext = createContext();

export default function AuthContextProvider({ children }) {
  const serverUrl = "http://localhost:5000";
  // const [loading, setLoading] = useState(false);

  const value = {
    serverUrl,
    // loading,
    // setLoading,
  };
  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  );
}
