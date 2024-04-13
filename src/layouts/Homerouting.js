import React, { useContext, useState, useEffect, useRef } from "react";

function Homerouting() {


  useEffect(() => {
    // navigate("/example");
    global.window && (global.window.location.href = '/home.html')
  }, []);

  return (
    <div>


    </div>
  );
}

export default Homerouting;
