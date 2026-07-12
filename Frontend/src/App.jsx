import React from 'react'
import {Route , Routes , Navigate} from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import SignUp from './pages/Signup/SignUp.jsx'
import Contact from './pages/Contact/Contact.jsx'
import HowItWorks  from './pages/HowItWorks/HowItWorks.jsx'
import About from './pages/About/About.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Footer from './components/Footer.jsx'
import DashApp from "./pages/Dashboard/App.jsx";
import Pricing from "./pages/Pricing/Pricing.jsx";
import PaymentSuccess from "./pages/Pricing/PaymentSuccess.jsx";
import Policy from "./components/privacyPolicy/policy.jsx";





function App() {

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard/*" element={<DashApp />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/policy" element={<Policy />} />
      </Routes>
      {/* Placed the ToastContainer at the absolute root */}
            {/* This remains permanently mounted so child tab redirect transitions don't cut off animations eventually we can provide toast to any child component for the use  */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
    </>
  );
}

export default App
