
import { Button, Container, Row, Col } from "reactstrap";
import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "Globalstate.js";

const UserHeader = () => {
  const [{ userdetails, loggedin, tradingpair }, dispatch] =
    useContext(GlobalContext);
  return (
    <>
      <div
        className="header pb-5 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
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
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">Hello {userdetails.fullName}  {userdetails.firstName}</h1>
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
