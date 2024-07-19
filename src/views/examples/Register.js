import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

const Register = () => {
  // State variables for personal information
  // const [firstName, setFirstName] = useState("");
  // const [surname, setSurname] = useState("");
  // const [gender, setGender] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");

  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);

  // const handleSignUp = async (e) => {
  //   e.preventDefault();

  //   const requiredFields = [
  //     { field: firstName, label: "First Name" },
  //     { field: surname, label: "Surname" },
  //     { field: gender, label: "Gender" },
  //     { field: email, label: "Email" },
  //     { field: password, label: "Password" },
  //     { field: phoneNumber, label: "Phone Number" },
  //   ];

  //   const emptyFields = requiredFields.filter(({ field }) => !field);

  //   if (emptyFields.length > 0) {
  //     const emptyFieldsLabels = emptyFields
  //       .map(({ label }) => label)
  //       .join(", ");
  //     setError(`Please fill out all required fields: ${emptyFieldsLabels}`);
  //     return;
  //   }
  //   if (!email.includes("@")) {
  //     setError("Please enter a valid email address");
  //     return;
  //   }
  //   if (password.length < 8) {
  //     setError("Password must be at least 8 characters long");
  //     return;
  //   }
  //   if (password.length > 100) {
  //     setError("Password must be less than 100 characters long");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     // Create user account with email and password
  //     const { user } = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );

  //     // Store user registration data in Firestore
  //     const userData = {
  //       firstName,
  //       surname,
  //       gender,
  //       email,
  //       phoneNumber,
  //     };

  //     await setDoc(doc(collection(db, "users"), user.uid), userData);
  //     console.log("User registration data stored successfully!");
  //   } catch (error) {
  //     console.error("Error signing up:", error);
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              {/* <small>Select Any Of The Options</small> */}
            </div>
            <div className="btn-wrapper text-center">

              {/* <a className="btn btn-neutral btn-icon" href="ridereg2">
                <span
                  className="btn-inner--icon"
                  role="img"
                  aria-label="Company Rider"
                >
                  🏍️
                </span>
                <span className="btn-inner--text">
                  Sign up as Company Rider
                </span>
              </a> */}

              <a className="btn btn-neutral btn-icon mb-2" href="ridereg">
                <span className="btn-inner--icon" role="img" aria-label="Rider">
                  🚴‍♂️
                </span>
                <span className="btn-inner--text ">Sign up as Rider</span>
              </a>

              <a className="btn btn-neutral btn-icon mb-2" href="usereg">
                <span className="btn-inner--icon" role="img" aria-label="User">
                  👤
                </span>
                <span className="btn-inner--text">Sign up as User</span>
              </a>

              <a className="btn btn-neutral btn-icon mb-2" href="companyreg">
                <span className="btn-inner--icon" role="img" aria-label="User">
                  🏠
                </span>
                <span className="btn-inner--text">Sign up as Company</span>
              </a>
            </div>
          </CardHeader>

          {/* <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>REGISTER AS USER</small>
            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="First Name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Surname"
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-female" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Gender"
                    type="text"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
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
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-mobile-button" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Phone Number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                {error && (
                  <div className="text-center text-danger mb-3">{error}</div>
                )}
                <Button
                  onClick={(e) => handleSignUp(e)}
                  className="mt-4"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Register Now"}
                </Button>
              </div>
            </Form>
          </CardBody> */}
        </Card>
      </Col>
    </>
  );
};

export default Register;
