import React, { useEffect, useContext, useState } from "react";
import { useLocation, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
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
import CompNavbar from "components/Navbars/CompNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/CompSidebar.js";
import { GlobalContext } from "Globalstate.js";
import routes from "routes.js";
import { getFirestore, collection, query, where, getDoc, getDocs, setDoc, doc } from "firebase/firestore";





const Company = (props) => {
  const navigate = useNavigate();
  const mainContent = React.useRef(null);

  const location = useLocation();
  const [{ userdetails, loggedin, tradingpair, distance }, dispatch] = useContext(GlobalContext);

  const [companyDetails, setCompanyDetails] = useState(null);


  console.log("Reload Check B", userdetails.uniqueId);

  useEffect(() => {

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



  // //////////////////////////////////////////

  const fetchCompanyData = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const compData = await getDoc(doc(db, "company", user.uid));
        if (compData.exists()) {
          setdetails(compData.data());
          console.log(compData.data());
        } else {
          console.log("User data not found in Firestore.");
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // setLoading(false);
      }
    } else {
      navigate("/auth/login");
    }
  });
  return () => fetchCompanyData();
}, []);


const setdetails = (data) => {
  dispatch({ type: "setuserdetails", snippet: data });
};


console.log("Check F: ", userdetails)












// const storeCompanyDetails = async (companyData) => {
//   const userId = state.userdetails.uniqueId; // or another unique identifier
//   try {
//     await setDoc(doc(db, "companyDetails", userId), companyData);
//     console.log("Company details stored successfully");
//   } catch (error) {
//     console.error("Error storing company details:", error);
//   }
// };

// const fetchStoredCompanyDetails = async () => {
//   const userId = state.userdetails.uniqueId; // or another unique identifier
//   try {
//     const docRef = doc(db, "companyDetails", userId);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       const data = docSnap.data();
//       setCompanyDetails(data);
//       console.log("Retrieved company details:", data);
//     } else {
//       console.log("No such document!");
//     }
//   } catch (error) {
//     console.error("Error fetching company details:", error);
//   }
// };
// // ////////////////////////////////////////////////

// useEffect(() => {


//   fetchStoredCompanyDetails();

//   console.log("state A:", state)
//   const fetchCompanyData = async () => {

//     try {
//       if (state.userdetails) {
//         const db = getFirestore();
//         const companyRef = doc(db, "company");
//         const q = query(companyRef, where("uniqueId", "==", state.userdetails.uniqueId));
//         const querySnapshot = await getDocs(q);
//         if (!querySnapshot.empty) {
//           querySnapshot.forEach(doc => {

//             const data = doc.data();
//             setCompanyDetails(data);
//             storeCompanyDetails(data);

//             // setCompanyDetails(doc.data());
//             console.log("Document Data E:", data);
//           });
//         } else {
//           console.log("No documents found with the specified username.");
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching company data:", error);
//     }
//   };

//   fetchCompanyData();
// }, [state.userdetails]);



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
        innerLink: "/company",
        imgSrc: require("../assets/img/brand/argon-react.png"),
        imgAlt: "...",
      }}
    />
    <div className="main-content" ref={mainContent}>
      <CompNavbar
        {...props}
        brandText={getBrandText(props?.location?.pathname)}
      />

      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/company" replace />} />
      </Routes>

      <div>


        <div
          className="header  d-flex align-items-center">



          {/* Mask */}

          <span className="mask   opacity-8" />




          {/* Header container */}



          {/* <Container className="" fluid>
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

          </Container> */}


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