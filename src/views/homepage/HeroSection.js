import React from 'react'

function HeroSection() {
    // RETURN aos TO AOS
    // or 
    // find and implement another animation
  return (
    <>
      <section class="my-4">
        <div class="container">
          <div class="row align-items-center">
            <div
              class="col-md-6"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="300"
            >
              <div class="d-sm-fle">
                <div className="col--5">
                  <h1 className="fs-1">
                    Welcome to Africa's Innovative Courier Platform
                  </h1>
                </div>
                <div className='col--7'>
                  <p className="w-1/3">
                    Enjoy excellent and seamless courier and dispatch service
                    experience with Starrik, an AI powered platform connecting
                    thousands of trustworthy dispatch service providers with
                    millions of customers across the globe.
                  </p>
                </div>
              </div>
              <div className='d-flex col-8 col-sm-12 justify-content-around'>
                <a href="/auth/login" class="button button-2">
                  Login
                </a>
                <a href="/auth/register" class="button button-2">
                  Register
                </a>
              </div>
            </div>
            <div
              class="col-md-6"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="400"
            >
              <div class="img-restaurant">
                <img alt="man" src="img/photo-1.png" />
                <div class="wilmington">
                  <img alt="img" src="img/photo-2.jpg" />
                  <div>
                    <p>Rider of the Month</p>
                    <h6>The lipDrop</h6>
                    <div>
                      <i class="fa-solid fa-star"></i>
                      <i class="fa-solid fa-star"></i>
                      <i class="fa-solid fa-star"></i>
                      <i class="fa-solid fa-star"></i>
                      <i class="fa-regular fa-star-half-stroke"></i>
                    </div>
                  </div>
                </div>

                <div class="wilmington location-restaurant">
                  <i class="fa-solid fa-location-dot"></i>
                  <div>
                    <h6>200+ Riders</h6>
                    <p>In Your city</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection