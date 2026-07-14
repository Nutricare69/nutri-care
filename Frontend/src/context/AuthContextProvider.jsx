import React, { createContext, useState } from "react";
export const authDataContext = createContext();

export default function AuthContextProvider({ children }) {
  const serverUrl = import.meta.env.VITE_BACKEND_URL;

  const value = {
    serverUrl, 
  };
  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  );
}
