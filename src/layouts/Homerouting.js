import TACLayout from "components/termsAndConditions/TACLayout";
import React, { useContext, useState, useEffect, useRef } from "react";
import Counter from "views/homepage/Counter";
import FoodGap from "views/homepage/FoodGap";
import Footer from "views/homepage/Footer";
import HeroSection from "views/homepage/HeroSection";
import Navbar from "views/homepage/Navbar";
import PageLoader from "views/homepage/PageLoader";
import Partnership from "views/homepage/Partnership";
import Reviews from "views/homepage/Reviews";
import Slide from "views/homepage/Slide";
import Subscribe from "views/homepage/Subscribe";

function Homerouting() {


  useEffect(() => {
    // navigate("/example");
    // global.window && (global.window.location.href = '/home.html')
  }, []);

  return (
    <div>
      {/* <PageLoader /> */}
      <Navbar />
      <HeroSection />
      <Slide />
      <FoodGap />
      <Counter />
      <Reviews />
      <Partnership />
      <Subscribe />
      <Footer />

    </div>
  );
}

export default Homerouting;
