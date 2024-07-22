import React from 'react'
import {
  Badge,
  Card,
  CardHeader,
  Table,
  CardBody,
  Container,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "Globalstate.js";
import { CollectionReference } from "firebase/firestore";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";


const CompDash = () => {

  const { state } = useContext(GlobalContext);
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        if (state.userdetails && state.userdetails.uid) {
          const companyRef = doc(db, "company", state.userdetails.uid);
          const companyDoc = await getDoc(companyRef);
          if (companyDoc.exists()) {
            setCompanyDetails(companyDoc.data());
            console.log("companyDetails: ",companyDetails)
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, [state.userdetails]);



  // console.log("")




  // const user = location.state?.user || userdetails;
  // React.useEffect(() => {
  //   if (user) {
  //     dispatch({ type: "setuserdetails", snippet: user }); // +++ Dispatch user details to context
  //   }
  // }, [user, dispatch]);
  // console.log("User" + userdetails.compName)
  // $$$$$$$$%%%%%%%%%%%%%%$$$$$$$$$$$$$$$$$$$$$%%%%%%%%%


  return (
    <>

      <div
        className="header pt-7 pt-lg-8 d-flex align-items-center">



        {/* Mask */}

        <span className="mask pt-9 bg-gradient-default opacity-8" />




        {/* Header container */}



        <Container className="mt-" fluid>
          <Row className="mt-5">
            <div className="col">
              <Card className="bg-default shadow">
                <CardHeader className="bg-transparent border-0">
                  <h3 className="text-white mb-0">My Company Riders Profiles</h3>
                </CardHeader>

                <CardBody>
                  {companyDetails ? (
                    <div>
                      <h4 className="text-white">Company Name: {companyDetails.name}</h4>
                      {/* Add more company details as needed */}
                    </div>
                  ) : (
                    <div className="text-white">Loading company details...</div>
                  )}
                </CardBody>


              </Card>
            </div>
          </Row>

        </Container>


      </div>

    </>





  )
}

export default CompDash