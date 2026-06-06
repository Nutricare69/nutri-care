import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import AuthContext from "./context/AuthContextProvider.jsx";
import UserContext from './context/UserContext.jsx';
import { ThemeProvider } from './components/theme.js';
// import UserContext from "./context/UserContext.jsx";
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContext>
        <UserContext>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </UserContext>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>
)
