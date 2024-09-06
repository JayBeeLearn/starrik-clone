import React, { useState } from "react";
import { faqQuesAns } from "assets/data/faq";
import { Link } from "react-router-dom";

function Footer() {
  const [faqs, setFaqs] = useState(faqQuesAns);
  const [revealFaq, setRevealFaq] = useState(false);
  const [domAnswers, setDomAnswers] = useState([]);

  const handleReveal = (index) => {
    // let answers = document.querySelectorAll('.answer')
    // setDomAnswers(answers)
    // // console.log(domAnswers);
    // // faqs.map((faq0) => {
    // //     return faq0
    // // })
    // domAnswers.map((ans) => {
    //     return ans
    // })
    // answers.forEach((answer) => {
    //     return answer
    //     // if (answer.id == index) {
    //     //     answers
    //     //     // answer.addClass('d-block')
    //     //     return answer.id
    //     // }
    // })
    // console.log(answers);
  };
  return (
    <>
      <footer class="pt-4" style={{ backgroundColor: "#363636" }}>
        <div class="container">
          <div class="row">
            <div class="col-12 col-sm-12 col-lg-5 col-md-4 ">
              <div class="footer-description">
                <Link to={"/"}>
                  <img
                    src="img/argon-react.png"
                    style={{ maxWidth: 100 + "px" }}
                    class="img-fluid"
                    alt="Responsive image"
                  />
                </Link>
                <h2>Delivering Excellence to Your Doorstep</h2>
                <p>
                  Experience seamless and excellent Courier services tailored to
                  your needs. From packages to groceries, we ensure your items
                  are delivered promptly and securely, while adding value,
                  prestige and class to our users.
                </p>
              </div>
            </div>
            <div class="col-5 col-sm-6 col-lg-3 col-md-4 ">
              <div class="menu">
                <h4>Menu</h4>
                <ul class="footer-menu">
                  <li>
                    <Link to={"/"}>
                      Home<i class="fa-solid fa-arrow-right"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to={"/about-us"}>
                      About Us<i class="fa-solid fa-arrow-right"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to={"/contact-us"}>
                      Contact<i class="fa-solid fa-arrow-right"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to={"/terms-and-conditions/user"}>
                      User Terms and Conditions
                      <i class="fa-solid fa-arrow-right"></i>
                    </Link>
                  </li>

                  <li>
                    <Link to={"/terms-and-conditions/rider"}>
                      Riders Terms and Conditions
                      <i class="fa-solid fa-arrow-right"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-7 col-sm-6 col-lg-4 col-md-4 ">
              <div class="menu contacts">
                <h4>Contacts</h4>
                <div class="footer-location">
                  <i class="fa-solid fa-location-dot"></i>
                  <p>
                    32 Prince Enobong Uwah Street, Uyo, Akwa Ibom State,
                    Nigeria.
                  </p>
                </div>
                <a href="mailto:info@starrik.com">
                  <i class="fa-solid fa-envelope"></i>info@starrik.com
                </a>
                <a href="callto:+2348171222262">
                  <i class="fa-solid fa-phone"></i>+234 817 1222 262
                </a>
              </div>
              <ul class="social-media d-flex my-4">
                <li>
                  <a href="https://www.facebook.com/profile.php?id=100071754730672">
                    <i class="fa-brands fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/starrik_tech?igsh=aTlwcmJ4NW82YzZj">
                    <i class="fa-brands fa-instagram"></i>
                  </a>
                </li>
                {/* <!-- <li><a href="#"><i class="fa-brands fa-twitter"></i></a></li> --> */}
                <li>
                  <a href="https://youtube.com/@Starriktech?si=OGMNMVi4VvnmM3x3">
                    <i class="fa-brands fa-youtube"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* <!--############### FAQ ##############-->

                    <!--******************  *******************-->
                    <!--******************  *******************-->
                    <!-- styling of FAQ is inline and internal -->
                    <!--          JS code is below			   -->
                    <!--  									   -->
                    <!--******************  *******************-->
                    <!--******************  *******************--> */}

          <div class="menu" style={{ color: "#CFcfcf;" }}>
            <h4 class="">FAQ</h4>
            <div class=" faq-list" id="faqList">
              {faqs.map((faq, index) => {
                return (
                  <div key={index} className="d-flex">
                    <ul>
                      <li className="mx-2">{index + 1} </li>
                    </ul>
                    <div>
                      <p
                        key={index}
                        className={`question-btn`}
                        onClick={() => handleReveal(index)}
                      >
                        {faq.quest}
                      </p>
                      <p
                        id={index}
                        className={` ${
                          revealFaq ? "d-block" : "d-none"
                        }    question `}
                      >
                        {" "}
                        {faq.ans}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* <!-------------------- end of FaQS  ---------------------> */}
        </div>

        {/* <!-- #endregion --> */}
        <div class="footer-two d-flex justify-content-center">
          <p>Copyright © 2024. Starrik. All rights reserved.</p>
          {/* <div class="privacy">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Services</a>
          </div> */}
        </div>
      </footer>
    </>
  );
}

export default Footer;
