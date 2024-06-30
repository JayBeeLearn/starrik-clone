import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { collection, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
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
  Progress,
} from "reactstrap";
import Swal from "sweetalert2";

const RiderReg = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // State variables for personal information
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [phoneNumber, setPhoneNumber] = useState("");
  const [homeAddress, setHomeAddress] = useState("");

  // State variables for business information
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
  const [bikeRegistrationNumber, setBikeRegistrationNumber] = useState("");
  const [bikeRegistrationType, setBikeRegistrationType] = useState("");

  // State variables for next of kin information
  const [kinFullName, setKinFullName] = useState("");
  const [kinPhoneNumber, setKinPhoneNumber] = useState("");
  const [kinEmail, setKinEmail] = useState("");
  const [kinRelationship, setKinRelationship] = useState("");
  const [kinAddress, setKinAddress] = useState("");

  // State variables for account information
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  // State to toggle password visibility for pass

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordConfirmVisibility = () => {
    setPasswordConfirmVisible(!passwordConfirmVisible);
  };

  const handleFileUpload = async (e, filetype) => {
    // Function for file upload as before
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

// implementing userID generator

  const generateUserId = async () => {
    let uniqueId;
    const dbRef = collection(db, "independentriders");
    
    do {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      uniqueId = `strk${randomNum}`;
      
      const querySnapshot = await getDocs(query(dbRef, where("uniqueId", "==", uniqueId)));
      if (querySnapshot.empty) {
        break; 
      }
     
    } while (true);
    
    return uniqueId;
  };

  const handleSignUp = async (e) => {

    e.preventDefault();
    const requiredFields = [
      { field: fullName, label: "Full Name" },
      { field: dateOfBirth, label: "Date of Birth" },
      { field: email, label: "Email" },
      { field: password, label: "Password" },
      { field: confirmPassword, label: "Confirm Password" }, 
      // Added confirm password to required fields and removed Gender

      { field: phoneNumber, label: "Phone Number" },
      { field: homeAddress, label: "Home Address" },
      { field: businessName, label: "Business Name" },
      { field: businessAddress, label: "Business Address" },
      { field: businessRegistrationNumber, label: "Business Registration Number" },
      { field: bikeRegistrationNumber, label: "Bike Registration Number" },
      { field: bikeRegistrationType, label: "Bike Registration Type" },
      { field: kinFullName, label: "Next of Kin Full Name" },
      { field: kinPhoneNumber, label: "Next of Kin Phone Number" },
      { field: kinRelationship, label: "Next of Kin Relationship" },
      { field: kinAddress, label: "Next of Kin Address" },
      { field: accountName, label: "Account Name" },
      { field: accountNumber, label: "Account Number" },
      { field: bankName, label: "Bank Name" },
      { field: accountType, label: "Account Type" },
    ];
    const emptyFields = requiredFields.filter(({ field }) => !field);
    if (emptyFields.length > 0) {
      const emptyFieldsLabels = emptyFields.map(({ label }) => label).join(", ");
      setError(`Please fill out all required fields: ${emptyFieldsLabels}`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (password.length > 100) {
      setError("Password must be less than 100 characters long");
      return;
    }
    setLoading(true);
    try {
      // Create user account with email and password
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

// so this will generate the userID assyncn
      const uniqueId = await generateUserId();

      // Handling email verification for riders

      await sendEmailVerification(user);

      // Store user registration data in Firestore
      const userData = {
        uniqueId,
        fullName,
        dateOfBirth,
        email,
        phoneNumber,
        homeAddress,
        businessName,
        businessAddress,
        businessRegistrationNumber,
        bikeRegistrationNumber,
        bikeRegistrationType,
        kinFullName,
        kinPhoneNumber,
        kinEmail,
        kinRelationship,
        kinAddress,
        accountName,
        accountNumber,
        bankName,
        accountType,
        RiderBal: 0,
        dateCreated: serverTimestamp(),
      };

      await setDoc(doc(collection(db, "independentriders"), user.uid), userData);

      // added message
      Swal.fire({
            icon: "success",
            title: "Registration Successful",
            text: "A verification email has been sent. Please check your inbox.",
          });
      navigate("/admin/index");
    } catch (error) {
      console.log(error.message);
      setError(error.message);

      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Email already in use!",
        });
        setError("Email already in use!");
      }

      if (error.message === "Firebase: Error (auth/invalid-email).") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid Email Address",
        });
        setError("Invalid Email Address");
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <Col lg="6" md="8">
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <small>REGISTER AS INDEPENDENT RIDER</small>
          </div>

          <Progress value={(currentStep / 4) * 100} className="mb-4" />

          <Form role="form">
            {currentStep === 1 && (
              <>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Full Name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-calendar-grid-58" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Date of Birth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type={passwordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputGroupAddon addonType="append">
                      <Button
                        onClick={togglePasswordVisibility}
                        type="button"
                        className="btn-sm"
                      >
                        {<i className={passwordVisible ? "fa fa-eye-slash" : "fa fa-eye"} />}

                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>


                {/* Added confirm password and removed gender */}

                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Confirm Password"
                      type={passwordConfirmVisible ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputGroupAddon addonType="append">
                      <Button
                        onClick={togglePasswordConfirmVisibility}
                        type="button"
                        className="btn-sm"
                      >
                        {<i className={passwordConfirmVisible ? "fa fa-eye-slash" : "fa fa-eye"} />}
                      </Button>
                    </InputGroupAddon>
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
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-square-pin" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Home Address"
                      type="text"
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
              </>
            )}

            {currentStep === 2 && (
              <>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-shop" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Business Name"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-square-pin" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Business Address"
                      type="text"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-badge" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Business Registration Number"
                      type="text"
                      value={businessRegistrationNumber}
                      onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-delivery-fast" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Bike Registration Number"
                      type="text"
                      value={bikeRegistrationNumber}
                      onChange={(e) => setBikeRegistrationNumber(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-tag" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Bike Registration Type"
                      type="text"
                      value={bikeRegistrationType}
                      onChange={(e) => setBikeRegistrationType(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
              </>
            )}

            {currentStep === 3 && (
              <>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Next of Kin Full Name"
                      type="text"
                      value={kinFullName}
                      onChange={(e) => setKinFullName(e.target.value)}
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
                      placeholder="Next of Kin Phone Number"
                      type="text"
                      value={kinPhoneNumber}
                      onChange={(e) => setKinPhoneNumber(e.target.value)}
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
                      placeholder="Next of Kin Email"
                      type="email"
                      value={kinEmail}
                      onChange={(e) => setKinEmail(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-favourite-28" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Relationship with Next of Kin"
                      type="text"
                      value={kinRelationship}
                      onChange={(e) => setKinRelationship(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-square-pin" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Next of Kin Address"
                      type="text"
                      value={kinAddress}
                      onChange={(e) => setKinAddress(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
              </>
            )}

            {currentStep === 4 && (
              <>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Account Name"
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-credit-card" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Account Number"
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-bag-17" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Bank Name"
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-briefcase-24" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Account Type"
                      type="text"
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
              </>
            )}

            {error && (
              <div className="text-center">
                <small className="text-danger">{error}</small>
              </div>
            )}

            <div className="text-center">
              {currentStep !== 1 && (
                <Button onClick={handlePrev} color="primary" className="mt-4">
                  Previous
                </Button>
              )}
              {currentStep !== 4 ? (
                <Button onClick={handleNext} color="primary" className="mt-4">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSignUp} color="primary" className="mt-4" disabled={loading}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              )}
            </div>
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
};

export default RiderReg;
