
import { Button, Container, Row, Col } from "reactstrap";
import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "Globalstate.js";
import { CollectionReference } from "firebase/firestore";





const UserHeader = () => {

  const [{ userdetails, loggedin, tradingpair}] =
    useContext(GlobalContext);

  // $$$$$$$$%%%%%%%%%%%%%%$$$$$$$$$$$$$$$$$$$$$%%%%%%%%%


  return (
    <>
      <div
        className="header pb-5 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          position: 'relative',
          minHeight: "600px",
          backgroundImage:
            "url(" + require("../../assets/img/theme/profile-cover.jpg") + ")",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >




        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />


        {/* Header container */}
        <Container className=" d-flex align-items-center " fluid>



          <Row className="">

            <Col lg="7" md="10" className=" ">

              <div style={{ border:'1px solid black'}}  className="  ">
                
                <h1 className=" text-white leading-[0] ">Hello   {userdetails.firstName}</h1>
                <h1 style={{color:'whitesmoke'}} className="text-sm  pl-10   " >User Id: {userdetails.uniqueId}</h1>
                
              </div>

              <p className="text-white mt-0 mb-5">
                This is your profile page where you can manage your account details. Update your username, email, and address to keep your information current and accurate.
              </p>

              {/* <Button
                color="info"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                Edit profile
              </Button> */}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;
