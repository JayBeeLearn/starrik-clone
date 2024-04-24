import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "Globalstate.js";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,Alert
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../../firebase";

const Profile = () => {
  const navigate = useNavigate();
  const [{ userdetails, loggedin, tradingpair }, dispatch] =
    useContext(GlobalContext);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [success2, setSuccess2] = useState(false);
  const [error2, setError2] = useState(false);

  //////////////////////////////////////////////////////
  //////////////////////AUTHENTICATION///////////////////////////////
  //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////

  useEffect(() => {
    // console.log("fetching UserId: ", auth.currentUser.uid)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setLoading(true);
          // Get user details from Firestore
          const userDoc = await getDoc(doc(db, "independentriders", user.uid));
          if (userDoc.exists()) {
            // userDoc.data().id = user.uid;
            setUser(userDoc.data());
            setdetails({ ...userDoc.data(), id: user.uid });
            // console.log(userDoc.data());
            // setLoading(false);
          } else {
            console.log("User data not found in Firestore.");
            // setLoading(false);
            navigate("/auth/login");
          }
          // setModalOpen(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // setLoading(false);
        }
      } else {
        // If user is not logged in, redirect to login page
        // history.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const setdetails = (data) => {
    dispatch({ type: "setuserdetails", snippet: data });
  };

  const setloggedin = (data) => {
    dispatch({ type: "setloggedin", snippet: data });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // history.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  //////////////////////AUTHENTICATION///////////////////////////////
  //////////////////////////////////////////////////////

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userDocRef = doc(db, "independentriders", userdetails.id); // Replace 'userId' with the actual user ID
      await updateDoc(userDocRef, {
        ...user,
      });

      setSuccess("Account updated successfully.");
      setSuccess2(true);
      setError2(false)
      setError("");
    } catch (err) {
      setError("Error updating account.");
      console.error("Error updating account:", err);
      setSuccess2(false);
      setError2(true)
    }

    window.location.reload();
  };

  const alertStyles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '1000',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center'
  };

  return (
    <>
      <UserHeader />
      {success2 && (
        <Alert color="success" style={alertStyles}>
          {success}
        </Alert>
      )}

      {/* Error Alert */}
      {error2 && (
        <Alert color="danger" style={alertStyles}>
          {error}
        </Alert>
      )}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Settings
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    {/* ... */}
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Username
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            id="input-username"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                           Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="address"
                            value={user.address}
                            onChange={handleChange}
                            id="input-address"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {/* ... */}
                  </div>
                  <hr className="my-4" />
                  <div className="text-center">
                    <Button color="primary" type="submit">
                      Update Account
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
