import React from "react";

function Partnership() {
  return (
    <>
      <section class="join-partnership gap" style={{ backgroundColor: "#363636" }}>
        <div class="container">
          <h2>Want to Join As A Rider?</h2>
          <div class="row">
            <div
              class="col-lg-6"
              data-aos="flip-up"
              data-aos-delay="200"
              data-aos-duration="300"
            >
              <div class="join-img">
                <img alt="img" src="img/photo-6.jpg" />
                <div class="Join-courier  ">
                  <h3>Join independently</h3>
                  <a href="become-partner.html" class="button button-2">
                    Learn More <i class="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
            <div
              class="col-lg-6"
              data-aos="flip-up"
              data-aos-delay="300"
              data-aos-duration="400"
            >
              <div class="join-img">
                <img alt="img" src="img/photo-7.jpg" />
                <div class="Join-courier">
                  <h3>Join as a company</h3>
                  <a href="become-partner.html" class="button button-2">
                    Learn More
                    <i class="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Partnership;
