import React from "react";

function AboutIndex() {
  return (
    <>
      <section
        class=""
        style={{ backgroundImage: "url(img/background-1.png)" }}
      >
        <div class="container">
          <div class="row align-items-center">
            <div
              class="col-lg-6 col-md-12 col-sm-12"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="400"
            >
              <div class="about-text">
                <h2>Nothing to worry about with Starrik</h2>
                <p>
                  At our delivery company, we understand the importance of
                  efficient service. Sit back and relax as we ensure your
                  parcels are swiftly transported to their destination.
                </p>
              </div>
            </div>
            <div
              class="col-lg-6 col-md-12 col-sm-12"
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="500"
            >
              <div class="about-img">
                <img alt="man" src="img/photo-9.jpg"/>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- our-mission-section --> */}
      <section class="our-mission-section gap">
        <div class="container">
          <div class="row align-items-center">
            <div
              class="col-lg-6 col-md-12 col-sm-12"
              data-aos="flip-up"
              data-aos-delay="300"
              data-aos-duration="400"
            >
              <div class="our-mission-img">
                <img alt="Illustration" src="img/illustration-5.png" />
              </div>
            </div>
            <div
              class="offset-xl-1 col-lg-5 col-md-12 col-sm-12"
              data-aos="flip-up"
              data-aos-delay="400"
              data-aos-duration="500"
            >
              <div class="our-mission-text">
                <h2>MISSION </h2>
                <p>
                  Bringing the world together through leveraging technology and
                  innovation.
                </p>

                <h2>VISION </h2>
                <p>
                  To become the world's largest, most excellent and Prestigious
                  brand, creating a higher sense of purpose for humanity!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- cards-section --> */}
      <section class="cards-section gap no-top">
        <div class="container">
          <div class="row">
            <div
              class="col-xl-4 col-lg-4 col-md-6 col-sm-12"
              data-aos="flip-up"
              data-aos-delay="300"
              data-aos-duration="400"
            >
              <div class="card-text-data two">
                <img
                  class="on"
                  alt="icon"
                  src="https://img.icons8.com/?size=64&id=T8q9lmoVmRaI&format=png"
                />
                <img
                  class="off"
                  alt="icon"
                  src="https://img.icons8.com/?size=64&id=T8q9lmoVmRaI&format=png"
                />
                <h3>Save Your Time</h3>
                <p>
                  Streamline your schedule by saving time with our efficient
                  delivery service. Say goodbye to long queues and tedious
                  errands, and let us handle the rest.
                </p>
              </div>
            </div>
            <div
              class="col-xl-4 col-lg-4 col-md-6 col-sm-12"
              data-aos="flip-up"
              data-aos-delay="400"
              data-aos-duration="500"
            >
              <div class="card-text-data">
                <img
                  class="on"
                  alt="icon"
                  src="https://img.icons8.com/?size=80&id=64867&format=png"
                />
                <img
                  class="off"
                  alt="icon"
                  src="https://img.icons8.com/?size=80&id=64867&format=png"
                />
                <h3>Regular Discounts</h3>
                <p>
                  Unlock savings with our regular discounts on delivery
                  services. We believe in providing value to our customers
                  through cost-effective solutions.
                </p>
              </div>
            </div>
            <div
              class="col-xl-4 col-lg-4 col-md-6 col-sm-12"
              data-aos="flip-up"
              data-aos-delay="500"
              data-aos-duration="600"
            >
              <div class="card-text-data two">
                <img
                  class="on"
                  alt="icon"
                  src="https://img.icons8.com/?size=80&id=110192&format=png"
                />
                <img
                  class="off"
                  alt="icon"
                  src="https://img.icons8.com/?size=80&id=110192&format=png"
                />
                <h3>Variety of Services</h3>
                <p>
                  Explore a wide range of delivery services tailored to your
                  needs. From express deliveries to specialized handling, we've
                  got you covered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="video-section gap">
        <div class="container">
          <div class="row align-items-center">
            <div
              class="col-lg-6"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="300"
            >
              <div class="wait-a-minute">
                <h2>Experience the Convenience of Delivery</h2>
                <p>
                  Discover the ease of having your packages and items delivered
                  directly to your doorstep. With our reliable delivery service,
                  you can save time and effort by avoiding trips to the store or
                  post office.
                </p>
                <h6>Why Choose Us?</h6>
                <ul class="paragraph">
                  <li>
                    <i class="fa-solid fa-circle-check"></i>
                    <h5>Timely and efficient delivery of your orders;</h5>
                  </li>
                  <li>
                    <i class="fa-solid fa-circle-check"></i>
                    <h5>Wide coverage area for convenient delivery options;</h5>
                  </li>
                  <li>
                    <i class="fa-solid fa-circle-check"></i>
                    <h5>Secure handling of your packages and items;</h5>
                  </li>
                  <li>
                    <i class="fa-solid fa-circle-check"></i>
                    <h5>
                      Responsive customer support to assist with any inquiries.
                    </h5>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="col-lg-6"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="400"
            >
              <div class="video-section-img">
                <img alt="elements" src="img/elements-1.jpg" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- about-counters-section --> */}
      <section
        class="about-counters-section gap"
        style={{ backgroundImage: "url(img/background.png)" }}
      >
        <div class="container">
          <div class="row align-items-center">
            <div
              class="col-lg-6 col-md-12 col-sm-12"
              data-aos="flip-up"
              data-aos-delay="200"
              data-aos-duration="300"
            >
              <div class="about-counters-img">
                <img alt="girl" src="img/photo-10.png" />
              </div>
            </div>
            <div
              class="col-lg-6 col-md-12 col-sm-12"
              data-aos="flip-up"
              data-aos-delay="300"
              data-aos-duration="400"
            >
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6">
                  <div class="counter-hading">
                    <h2>Service shows good taste.</h2>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6">
                  <div class="count-time">
                    <h2
                      class="timer count-title count-number"
                      data-to="976"
                      data-speed="2000"
                    >
                      976
                    </h2>
                    <p>
                      Satisfied
                      <br />
                      Customer
                    </p>
                  </div>
                </div>
                <div
                  class="col-lg-6 col-md-6 col-sm-6"
                  data-aos="flip-up"
                  data-aos-delay="300"
                  data-aos-duration="400"
                >
                  <div class="count-time">
                    <h2
                      class="timer count-title count-number"
                      data-to="1"
                      data-speed="2000"
                    >
                      1
                    </h2>
                    <span>k+</span>
                    <p>
                      Best
                      <br />
                      Riders
                    </p>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6">
                  <div class="count-time sp">
                    <h2
                      class="timer count-title count-number"
                      data-to="1"
                      data-speed="2000"
                    >
                      1
                    </h2>
                    <span>k+</span>
                    <p>
                      Food
                      <br />
                      Delivered
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Our Team Section --> */}
      <section class="our-team-section gap">
        <div class="container">
          <div
            class="hading"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="300"
          >
            <h2>Our team</h2>
            <p>
              MEET OUR TEAM OF INSPIRING AND TALENTED YOUNG MINDS PURSUING ONLY
              ONE GOAL - GREATNESS!
            </p>
          </div>
          <div class="row">
            <div
              class="col-xl-4 col-lg-6 col-md-6 col-sm-12"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="300"
            >
              <div class="our-team">
                <div
                  class="h-32 overflow-y-hidden"
                  style={{ height: 400 + "px", overflowY: "hidden" }}
                >
                  <img alt="team-img" src="img/benjamin.png" />
                </div>
                <h4>
                  <a href="#">BENJAMIN SHOWERS </a>
                </h4>
                <p>Marketing and Sales</p>
                <ul class="d-flex justify-content-between col-8 mx-auto my-2">
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-twitter"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="col-xl-4 col-lg-6 col-md-6 col-sm-12"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="400"
            >
              <div class="our-team">
                <div
                  class="h-32 overflow-y-hidden"
                  style={{ height: 400 + "px", overflowY: "hidden" }}
                >
                  <img alt="team-img" src="img/chinedu.png" />
                </div>
                <h4>
                  <a href="#">CHINEDU FAVOUR </a>
                </h4>
                <p>Corporate Communications </p>
                <ul class="d-flex justify-content-between col-8 mx-auto my-2">
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-twitter"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="col-xl-4 col-lg-6 col-md-6 col-sm-12"
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="500"
            >
              <div class="our-team">
                <div
                  class="h-32 overflow-y-hidden"
                  style={{ height: 400 + "px", overflowY: "hidden" }}
                >
                  <img alt="team-img" src="img/ajiboye.png" />
                </div>
                <h4>
                  <a href="#">AJIBOYE ENDURANCE </a>
                </h4>
                <p>Finance and Accounting</p>
                <ul class="d-flex justify-content-between col-8 mx-auto my-2">
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-twitter"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div
              class="col-xl-4 col-lg-6 col-md-6 col-sm-12"
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="500"
            >
              <div class="our-team">
                <div
                  class="h-32 overflow-y-hidden"
                  style={{ height: 400 + "px", overflowY: "hidden" }}
                >
                  <img alt="team-img" src="img/isaiah.png" />
                </div>
                <h4>
                  <a href="#">ISAIAH ODUOBUK</a>
                </h4>
                <p>Community and Customer Success </p>
                <ul class="d-flex justify-content-between col-8 mx-auto my-2">
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-twitter"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div
              class="col-xl-4 col-lg-6 col-md-6 col-sm-12"
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="500"
            >
              <div class="our-team">
                <div
                  class="h-32 overflow-y-hidden"
                  style={{ height: 400 + "px", overflowY: "hidden" }}
                >
                  <img alt="team-img" src="img/david.png" />
                </div>
                <h4>
                  <a href="#">DAVID EDEM </a>
                </h4>
                <p>Media </p>
                <ul class="d-flex justify-content-between col-8 mx-auto my-2">
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-twitter"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div
              class="col-xl-4 col-lg-6 col-md-6 col-sm-12"
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="500"
            >
              <div class="our-team">
                <div
                  class="h-32 overflow-y-hidden"
                  style={{ height: 400 + "px", overflowY: "hidden" }}
                >
                  <img alt="team-img" src="img/ezulike.png" />
                </div>
                <h4>
                  <a href="#">EZULIKE MERCY </a>
                </h4>
                <p>Contents </p>
                <ul class="d-flex justify-content-between col-8 mx-auto my-2">
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-twitter"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div
              class="col-xl-4 col-lg-6 col-md-6 col-sm-12"
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="500"
            >
              <div class="our-team">
                <div
                  class="h-32 overflow-y-hidden"
                  style={{height: 400 + 'px', overflowY: "hidden" }}
                >
                  <img alt="team-img" src="img/Idara.jpg" />
                </div>
                <h4>
                  <a href="#">IDARA GEORGE</a>
                </h4>
                <p>Finance & Accounting </p>

                <ul class="d-flex justify-content-between col-8 mx-auto my-2">
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-twitter"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div
              class="col-xl-4 col-lg-6 col-md-6 col-sm-12"
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="500"
            >
              <div class="our-team">
                <div class="h-32 overflow-y-hidden">
                  <div
                    class="h-32 overflow-y-hidden"
                    style={{height: 400 + 'px', overflowY: "hidden" }}
                  >
                    <img alt="team-img" src="img/ikise.png" />
                  </div>
                </div>
                <h4>
                  <a href="#">IKISE ATABANG </a>
                </h4>
                <p>Founder/CEO </p>
                <ul class="d-flex justify-content-between col-8 mx-auto my-2">
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa-brands fa-xl fa-twitter"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutIndex;
