import React, { useContext, useState, useEffect, useRef } from "react";
import TACLayout from "components/termsAndConditions/TACLayout";
import Navbar from "views/homepage/Navbar";
import { Outlet } from "react-router-dom";

function TermsAndCondition() {
  useEffect(() => {
    // navigate("/example");
    // global.window && (global.window.location.href = '/home.html')
  }, []);

  return (
    <div>
      {/* <PageLoader /> */}
      <Navbar />
      <TACLayout />
      
      <div> 

        <Outlet />
      </div>
      
    </div>
  );
}

export default TermsAndCondition;
