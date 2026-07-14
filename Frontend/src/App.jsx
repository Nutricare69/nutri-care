import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import SignUp from "./pages/Signup/SignUp.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import HowItWorks from "./pages/HowItWorks/HowItWorks.jsx";
import About from "./pages/About/About.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Footer from "./components/Footer.jsx";
import DashApp from "./pages/Dashboard/App.jsx";
import Pricing from "./pages/Pricing/Pricing.jsx";
import PaymentSuccess from "./pages/Pricing/PaymentSuccess.jsx";
import Policy from "./components/privacyPolicy/policy.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; //  IMPORTED: Security Gate Layer

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/*  Unprotected Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/policy" element={<Policy />} />

        {/*  PROTECTED ROUTE SHIELD LAYER */}
        {/* Any path structure matching dashboard parameters must clear the guard first */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<DashApp />} />
        </Route>

        {/* Global Fallback Catch Rule */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* Permanently Mounted Global Notifications Toast Engine Wrapper */}
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

export default App;
