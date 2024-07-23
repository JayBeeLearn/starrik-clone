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
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "Globalstate.js";
import { CollectionReference } from "firebase/firestore";
import { getFirestore, collection, query, where, getDoc, getDocs, setDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";



const CompDash = () => {

  const navigate = useNavigate();

  const [{ userdetails, loggedin, tradingpair, distance }, dispatch] = useContext(GlobalContext);
  const [companyDetails, setCompanyDetails] = useState(null);

  console.log("Reload Check", userdetails.uniqueId);

  // console.log("state B:", state.userdetails.compName)
  // console.log("state B:", state.userdetails.uid)

  // async function getDocumentIds() {
  //   const colRef = collection(db, "company");
  //   const snapshot = await getDocs(colRef);
  //   const docIds = snapshot.docs.map(doc => doc.id);
  //   console.log("Document IDs:", docIds);
  //   return docIds;


  // }

  // getDocumentIds();

  // console.log("Reload Check", state.userdetails.uniqueId)
  // console.log("Reload Check", state.userdetails.uniqueId)



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


  useEffect(() => {

    // fetchStoredCompanyDetails();
    // const colRef = collection(db, "company");
    // const snapshot = await getDocs(colRef);
    // const docIds = snapshot.docs.map(doc => doc.id);
    // console.log("Document IDs:", docIds);

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

















  //   if (state.userdetails) {
  //     const db = getFirestore();
  //     const companyRef = collection(db, "company");
  //     const q = query(companyRef, where("uniqueId", "==", state.userdetails.uniqueId));
  //     const querySnapshot = await getDocs(q);

  //     if (!querySnapshot.empty) {
  //       querySnapshot.forEach(doc => {

  //         const data = doc.data();
  //         setCompanyDetails(data);
  //         storeCompanyDetails(data);

  //         // setCompanyDetails(doc.data());
  //         console.log("Document Data D:", data);
  //       });
  //     } else {
  //       console.log("No documents found with the specified username.");
  //     }
  //   }
  // } catch (error) {
  //   console.error("Error fetching company data:", error);
  // }
  // };

  // fetchCompanyData();
  //     }, [state.userdetails]);



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
                  {userdetails ? (
                    <div>
                      <h4 className="text-white">Company Name: {userdetails.compName}</h4>
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