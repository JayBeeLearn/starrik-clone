import React from "react";

function ContactIndex() {
  return (
    <>
      <div>
        <section class=" ">
          <div class="container">
            <div class="row align-items-center">
              <div
                class="col-xl-6 col-lg-12"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="300"
              >
                <div class="about-text">
                  
                  <h2>Contact us</h2>
                  <p>
                    Have questions or need assistance? Reach out to us anytime.
                    Our dedicated team is here to help with all your delivery
                    needs.
                  </p>
                </div>
                <div class="row">
                  <div class="col-lg-4 col-md-4 col-sm-12">
                    <div class="address">
                      <i class="fa-solid fa-location-dot"></i>
                      <h5>
                        32 Prince Enobong Uwah Street, Uyo, Akwa Ibom State,
                        Nigeria.
                      </h5>
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-12">
                    <div class="address">
                      <i class="fa-solid fa-envelope"></i>
                      <a href="mailto:info@starrik.com">
                        <h6>info@starrik.com</h6>
                      </a>
                      <span>Email Us</span>
                      <a href="mailto:info@starrik.com">
                        <h6>info@starrik.com</h6>
                      </a>
                      {/* <!-- <span>Dolore magna aliqua</span> --> */}
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-12">
                    <div class="address">
                      <i class="fa-solid fa-phone"></i>
                      <a href="callto:+2348171222262">
                        <h6>+234 817 122 2262</h6>
                      </a>
                      <span>Call US.</span>
                      <a href="callto:+2348171222262">
                        <h6>+234 817 122 2262</h6>
                      </a>
                      {/* <!-- <span>Enim tortor auctor urna</span> --> */}
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="col-xl-6 col-lg-12"
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="400"
              >
                <div class="contact-us-img">
                  <img alt="contacts-img-girl" src="img/contacts-1.png" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- contact map --> */}
        <section class="gap no-top">
          <div class="container">
            <div class="row">
              <div
                class="col-lg-12"
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="400"
              >
                <div class="contact-map-data">
                  <div class="join-courier content">
                    <h3>Get in touch with us</h3>

                    <form class="blog-form">
                      <div class="name-form">
                        <i class="fa-regular fa-user"></i>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div class="name-form">
                        <i class="fa-regular fa-envelope"></i>
                        <input
                          type="text"
                          name="email"
                          placeholder="Enter your email"
                        />
                      </div>
                      <textarea placeholder="Enter your message"></textarea>
                      <button class="button-price">Submit Application</button>
                    </form>
                  </div>
                  <div class="contact-map">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104797.84993804592!2d7.932294797847573!3d5.029699191251963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x106284b63eb3f0e7%3A0x9220f0c66752b2c2!2sAkwa%20Ibom%2C%20Nigeria!5e0!3m2!1sen!2s!4v1661009847728!5m2!1sen!2s"
                      width="600"
                      height="450"
                      style={{ border:0 }}
                      allowfullscreen=""
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- subscribe-section --> */}
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
                    Access daily updates on our delivery service offerings.
                  </h2>
                  <form>
                    <i class="fa-regular fa-bell"></i>
                    <input
                      type="text"
                      name="email"
                      placeholder="Enter email address"
                    />
                    <button class="button button-2">Subscribe</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ContactIndex;
