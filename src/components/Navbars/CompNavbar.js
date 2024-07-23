
import { Link } from "react-router-dom";
import { GlobalContext } from "Globalstate.js";

// reactstrap components

import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { useState, useContext, useEffect } from "react";

import { getFirestore, collection, query, where, getDoc, getDocs, doc } from "firebase/firestore";

import { db, auth } from "../../firebase";
import { useLocation, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const CompNavbar = (props) => {

  const navigate = useNavigate();


  const [{ userdetails, loggedin, tradingpair, distance }, dispatch] = useContext(GlobalContext);
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {



    const fetchCompanyData = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // const colRef = collection(db, "company");
        // const snapshot = await getDocs(colRef);
        // const docIds = snapshot.docs.map(doc => doc.id);
        // console.log("Document IDs:", docIds);

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


  return (


    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}



            {/* Bring in userId here!!! */}
            {/*  ################################################              
                 ##################           ##################            ############################################## */}


          </Link>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>

                <Input placeholder="Search" type="text" />

              </InputGroup>
            </FormGroup>
          </Form>

          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>

              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">

                  {/* <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/team-4-800x800.jpg")}
                    />
                  </span> */}

                  <Media className="ml-2 d-none d-lg-block">

                    <span className="mb-0 text-sm font-weight-bold uppercase ">


                      {userdetails.compAdminFName}  {userdetails.compAdminLName}



                    </span>

                    {/* add profile picture below */}

                  </Media>
                </Media>
              </DropdownToggle>


              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default CompNavbar;
