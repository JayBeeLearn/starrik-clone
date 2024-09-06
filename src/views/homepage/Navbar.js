import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  const [navToggle, setNavToggle] = useState(false)
  const handleNavToggle = () => {
    
    setNavToggle(!navToggle)
  }
  return (
    <>
      <header>
        <div class="container ">
          {/* <!-- TABLET SCREEN size and ABOVE  --> */}
          <div class="row d-none d-sm-flex justify-content-between">
            <div class="col-sm-3">
              <div class="">
                <a href="/">
                  <img
                    src="img/argon-react.png"
                    class="img-fluid"
                    alt="Responsive image"
                  />
                </a>
              </div>
            </div>
            <div class="col-sm-5">
              <nav class="navbr">
                <ul class="navbar-links">
                  <li class="navbar-dropdown">
                    <NavLink to={"/"}>Home</NavLink>
                  </li>
                  <li class="navbar-dropdown">
                    <NavLink to={"/about-us"}>About Us</NavLink>
                  </li>

                  <li class="navbar-dropdown">
                    <NavLink to={"/contact-us"}>Contacts</NavLink>
                  </li>
                </ul>
              </nav>
            </div>
            <div class="col-sm-4 d-flex justify-content-end">
              <div class="d-flex">
                <a
                  href="javascript:void(0)"
                  id="desktop-menu"
                  class="menu-btn my-auto mx-4"
                >
                  <i class="fa-solid fa-bag-shopping fa-2xl"></i>
                </a>
                <a href="/auth/register" class="button button-2 my-auto">
                  Order Now
                </a>
              </div>
            </div>
          </div>
          {/* <!-- MOBILE PHONE SCREENS  --> */}
          <div class="row d-flex d-sm-none">
            <div class="col-4">
              <div class="headr-style">
                <Link to={"/"}>
                  <img
                    src="img/argon-react.png"
                    class="img-fluid"
                    alt="Responsive image"
                  />
                </Link>
              </div>
            </div>

            <div class="col-8 d-flex justify-content-end">
              <div class="d-flex ">
                <Link to={"/auth/register"} className="button button-2">
                  Order Now
                </Link>

                <Link onClick={handleNavToggle} className="my-auto mx-4">
                  <i class="fa-solid fa-bars fa-xl  "></i>
                </Link>
              </div>
            </div>

            <div className={` ${navToggle ? "d-block" : "d-none"}`}>
              <nav
                class="slide-in-down"
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="400"
              >
                <ul class="navbar-links">
                  <li class="navbar-dropdown">
                    <NavLink to={"/"}>Home</NavLink>
                  </li>
                  <li class="navbar-dropdown">
                    <NavLink to={"/about-us"}>About Us</NavLink>
                  </li>

                  <li class="navbar-dropdown">
                    <NavLink to={"/contact-us"}>Contacts</NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar