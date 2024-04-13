import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
} from "reactstrap";

const RiderReg = () => {
  const navigate = useNavigate();
  // State variables for personal information
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [homeAddress, setHomeAddress] = useState("");

  // State variables for business information
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] =
    useState("");

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

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log("idImage:", idImage);
    console.log("bikeRegistrationImage:", bikeRegistrationImage);
    const requiredFields = [
      { field: fullName, label: "Full Name" },
      { field: gender, label: "Gender" },
      { field: dateOfBirth, label: "Date of Birth" },
      { field: email, label: "Email" },
      { field: password, label: "Password" },
      { field: phoneNumber, label: "Phone Number" },
      { field: homeAddress, label: "Home Address" },
      { field: businessName, label: "Business Name" },
      { field: businessAddress, label: "Business Address" },
      {
        field: businessRegistrationNumber,
        label: "Business Registration Number",
      },
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
      { field: businessRegistrationImage, label: "Business Registration Image" },
      { field: bikeRegistrationImage, label: "Bike Registration" },
      { field: passportImage, label: "Passport Image" },
      { field: idImage, label: "ID Image" },
    ];

    const emptyFields = requiredFields.filter(({ field }) => !field);

    if (emptyFields.length > 0) {
      const emptyFieldsLabels = emptyFields
        .map(({ label }) => label)
        .join(", ");
      setError(`Please fill out all required fields: ${emptyFieldsLabels}`);
      return;
    }
    // if (!email.includes("@")) {
    //   setError("Please enter a valid email address");
    //   return;
    // }
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
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Store user registration data in Firestore
      const userData = {
        fullName,
        gender,
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
        businessRegistrationImage,
        bikeRegistrationImage,
        passportImage,
        idImage,
        RiderBal: 0,
      };

      await setDoc(
        doc(collection(db, "independentriders"), user.uid),
        userData
      );
      console.log("User registration data stored successfully!");
      navigate("/admin/index");
    } catch (error) {
      console.error("Error signing up:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  ////////////////////images.....................................
  const [businessRegistrationImage, setBusinessRegistrationImage] =
    useState("");
  const [bikeRegistrationImage, setBikeRegistrationImage] = useState("");
  const [passportImage, setPassportImage] = useState("");
  const [idImage, setIdImage] = useState("");
  ////////////////////images.....................................

  const [fileLoading, setFileLoading] = useState(false);
  const handleFileUpload = async (e, filetype) => {
    setFileLoading(true);

    const selectedFile = e.target.files[0];

    // Check file size
    if (selectedFile.size > 4 * 1024 * 1024) {
      alert("File size exceeds 4MB limit.");
      setFileLoading(false);
      return;
    }

    // Upload the file to Firebase Storage
    const storageRef = ref(storage, `files/${selectedFile.name}`);
    await uploadBytes(storageRef, selectedFile);

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(storageRef);

    switch (filetype) {
      case 1:
        console.log("File type 1:", downloadURL);
        setBusinessRegistrationImage(downloadURL);
        break;
      case 2:
        console.log("File type 2:", downloadURL);
        setBikeRegistrationImage(downloadURL);
        break;
      case 3:
        console.log("File type 3:", downloadURL);
        setPassportImage(downloadURL);
        break;
      case 4:
        console.log("File type 4:", downloadURL);
        setIdImage(downloadURL);
        break;
      default:
        console.log("Unknown file type:", downloadURL);
    }

    setFileLoading(false);
  };

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>REGISTER AS INDEPENDENT RIDER</small>
            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Name" type="text" />
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
                      <i className="ni ni-single-02" />
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
              {/* Business Information Fields */}
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
                      <i className="ni ni-credit-card" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Business Registration Number"
                    type="text"
                    value={businessRegistrationNumber}
                    onChange={(e) =>
                      setBusinessRegistrationNumber(e.target.value)
                    }
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
                      <i className="ni ni-credit-card" />
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
                    type="tel"
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
                      <i className="ni ni-circle-08" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Relationship"
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
                    placeholder="Contact Address"
                    type="text"
                    value={kinAddress}
                    onChange={(e) => setKinAddress(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              {/* Account Information Fields */}
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
              {/* const [bankName, setBankName] = useState(""); const [accountType,
              setAccountType] = useState(""); */}
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-credit-card" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Bank Number"
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
                      <i className="ni ni-credit-card" />
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

              {/* 
              ////////////////////images.....................................
  const [businessRegistrationImage, setBusinessRegistrationImage] =
    useState(null);
  const [bikeRegistrationImage, setBikeRegistrationImage] = useState(null);
  const [passportImage, setPassportImage] = useState(null);
  const [idImage, setIdImage] = useState(null);
  ////////////////////images..................................... */}
              <FormGroup>
                <label htmlFor="fileUpload" className="form-label">
                  business Registration Image
                </label>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-file" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="fileUpload"
                    placeholder="Company Account Type"
                    type="file"
                    onChange={(e) => handleFileUpload(e, 1)}
                  />
                </InputGroup>
                {fileLoading && <p>Uploading...</p>}
              </FormGroup>

              <FormGroup>
                <label htmlFor="fileUpload" className="form-label">
                  bike Registration Image
                </label>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-file" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="fileUpload"
                    placeholder="Company Account Type"
                    type="file"
                    onChange={(e) => handleFileUpload(e, 2)}
                  />
                </InputGroup>
                {fileLoading && <p>Uploading...</p>}
              </FormGroup>

              <FormGroup>
                <label htmlFor="fileUpload" className="form-label">
                  passport Image
                </label>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-file" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="fileUpload"
                    placeholder="Company Account Type"
                    type="file"
                    onChange={(e) => handleFileUpload(e, 3)}
                  />
                </InputGroup>
                {fileLoading && <p>Uploading...</p>}
              </FormGroup>

              <FormGroup>
                <label htmlFor="fileUpload" className="form-label">
                  id Image
                </label>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-file" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="fileUpload"
                    placeholder="Company Account Type"
                    type="file"
                    onChange={(e) => handleFileUpload(e, 4)}
                  />
                </InputGroup>
                {fileLoading && <p>Uploading...</p>}
              </FormGroup>

              <div className="text-muted font-italic">
                <small>
                  password strength:{" "}
                  <span className="text-success font-weight-700">strong</span>
                </small>
              </div>
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="text-center">
                {/* <Button className="mt-4" color="primary" type="button">
                Create account
              </Button> */}
                {error && (
                  <div className="text-center text-danger mb-3">{error}</div>
                )}
                <Button
                  // type="submit"
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
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default RiderReg;
