import React, { useEffect, useContext, useState } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components

import {
  Badge,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/CompSidebar.js";
import { GlobalContext } from "Globalstate.js";
import routes from "routes.js";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";





const Company = (props) => {
  const mainContent = React.useRef(null);

  const location = useLocation();

  // const [{ userdetails }] = useContext(GlobalContext);
  // const [companyDetails, setCompanyDetails] = useState(null);


  // useEffect(() => {
  //   const fetchCompanyData = async () => {
  //     try {
  //       if (userdetails && userdetails.uid) {
  //         const companyRef = doc(db, "company", userdetails.uid);
  //         const companyDoc = await getDoc(companyRef);
  //         if (companyDoc.exists()) {
  //           setCompanyDetails(companyDoc.data());
  //           console.log("Company component mounted");
  //           console.log("Comp Details", companyDetails)
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching company data:", error);
  //     }
  //   };
  //   fetchCompanyData();
  // }, [userdetails]);

  const { state } = useContext(GlobalContext);
  const [companyDetails, setCompanyDetails] = useState(null);

  console.log("Company 1")
  useEffect(() => {

    console.log("Company 2")
    const fetchCompanyData = async () => {
      console.log("Company 3")

      try {
        console.log("Company 4")
        if (state.userdetails && state.userdetails.uid) { console.log("Company 5")
          const companyRef = doc(db, "company", state.userdetails.uid);
          const companyDoc = await getDoc(companyRef);
          if (companyDoc.exists()) {
            console.log("Company 6")
            setCompanyDetails(companyDoc.data());
            console.log("companyDetails: ", companyDetails)
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, [state.userdetails]);



  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);


  // useEffect(() => {
  //   const fetchCompanyData = async () => {
  //     try {
  //       const user = props.user;
  //       if (user) {
  //         const companyRef = doc(collection(db, "company"), user.uid);
  //         const companyDoc = await getDoc(companyRef);
  //         if (companyDoc.exists()) {
  //           setUserDetails(companyDoc.data());
  //           console.log("userDetails")
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching company data:", error);
  //     } 
  //   }

  //   fetchCompanyData();
  // }, [props.user, setUserDetails]);


  console.log("Company code: 7")
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/company") {
        console.log("User path:", prop.path);
        return (

          <Route path={prop.path} element={prop.component} key={key} exact />

        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/company/companydash",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />

        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/company/companydash" replace />} />
        </Routes>

        <div>


          <div
            className="header  d-flex align-items-center">



            {/* Mask */}

            <span className="mask   opacity-8" />




            {/* Header container */}



            <Container className="" fluid>
              <Row className="">
                <div className="col">
                  <Card className=" shadow">
                    <Table
                      className="align-items-center  table-flush"
                      responsive
                    > <thead className="thead-dark">
                        <tr>
                          <th scope="col">S/N</th>
                          <th scope="col">rider</th>
                          <th scope="col">rider's Id</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <thead className="">
                        <tr>
                          <th scope="col">1</th>
                          <th scope="col">Daniel</th>
                          <th scope="col">StrCR85 </th>
                          <th scope="col">active</th>
                          <th scope="col">today's amount</th>
                          <th scope="col">:</th>
                        </tr>
                      </thead>

                    </Table>
                  </Card>
                </div>
              </Row>

            </Container>


          </div>

        </div>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>

    </>




  )
}

export default Company