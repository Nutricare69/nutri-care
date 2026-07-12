import React from "react";
import { Route, Routes } from "react-router-dom";
import ScrollToTop from "../../components/ScrollToTop.jsx";
import Dashboard from "./Dashboard.jsx";
import Settings from "./Settings.jsx";
import DietPlans from "./DietPlans.jsx";
import Analytics from "./Analytics.jsx";
import Community from "./Community.jsx";
import NgoSupport from "./NGOSupport.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Make Dashboard the parent layout layout container structure */}
        <Route path="/" element={<Dashboard />}>
          {/* Index tab view mounted exactly when navigating onto /dashboard */}
          <Route index element={<DietPlans />} />

          {/* Core App Subview Panel Target Slots */}
          <Route path="analytics" element={<Analytics />} />
          <Route path="community" element={<Community />} />
          <Route path="ngo" element={<NgoSupport />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}
