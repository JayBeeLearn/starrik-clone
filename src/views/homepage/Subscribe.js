import SubscribeInput from "components/fragments/SubscribeInput";
import React, { useState } from "react";

function Subscribe() {
  return (
    <>
      <section class="subscribe-section gap" style={{ background: "#fcfcfc" }}>
        <div class="container">
          <div class="row align-items-center">
            <div
              class="col-lg-6"
              data-aos="flip-up"
              data-aos-delay="200"
              data-aos-duration="300"
            >
              <div class="img-subscribe">
                <img alt="Illustration" src="img/illustration-4.png" />
              </div>
            </div>
            <div
              class="col-lg-5 offset-lg-1"
              data-aos="flip-up"
              data-aos-delay="300"
              data-aos-duration="400"
            >
              <div class="get-the-menu">
                <h2>
                  Be the first to know about what's happening next on Starrik.
                  Subscribe to our newsletter
                </h2>
                <SubscribeInput />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Subscribe;
