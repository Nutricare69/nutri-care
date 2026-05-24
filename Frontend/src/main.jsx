import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import AuthContext from "./context/AuthContextProvider.jsx";
import UserContext from './context/UserContext.jsx';
// import UserContext from "./context/UserContext.jsx";
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContext>
        <UserContext>
          <App />
          </UserContext>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>
)
