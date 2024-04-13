import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(email, password);
      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if the user exists in the 'user' collection
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        console.log("User exists in the 'user' collection");
        // Redirect user to the home page for users
        // history.push('/');
        navigate("/user/maps");
        return;
      }

      // Check if the user exists in the 'company' collection
      // check if user is verified
      const companyDoc = await getDoc(doc(db, "independentriders", user.uid));
      if (companyDoc.exists()) {
        console.log("User exists in the 'company' collection");
        // Redirect user to the home page for companies
        // history.push('/company-home');
        navigate("/admin/index");
        return;
      }
      // check if user is verified
      // Check if the user exists in the 'rider' collection
      const riderDoc = await getDoc(doc(db, "companies", user.uid));
      if (riderDoc.exists()) {
        console.log("User exists in the 'rider' collection");
        // Redirect user to the home page for riders
        // history.push('/rider-home');
        navigate("/admin/index");
        return;
      }

      // If user does not exist in any collection, log an error
      setError("User not found");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true); // Set loading state to true when Sign In button is clicked

  //     // Sign in user with email and password
  //     const userdoc = await signInWithEmailAndPassword(auth, email, password);
  //     console.log(userdoc);

  //     // Redirect to home page after successful login
  //     // history.push('/');
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false); // Reset loading state to false after authentication process is completed
  //   }
  // };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>sign in with credentials</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                {error && (
                  <div className="text-center text-danger mb-3">{error}</div>
                )}
                <Button
                  onClick={handleLogin}
                  className="my-4"
                  color="primary"
                  type="button"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Sign in"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="register"
              // onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
