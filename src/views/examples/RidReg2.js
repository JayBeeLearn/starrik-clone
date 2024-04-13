import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

const RiderReg2 = () => {
  // State variables for company information
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [cityStateCountry, setCityStateCountry] = useState("");
  const [companyRegistrationNumber, setCompanyRegistrationNumber] =
    useState("");

  // State variables for company principal officer
  const [principalOfficerName, setPrincipalOfficerName] = useState("");
  const [principalOfficerPhoneNumber, setPrincipalOfficerPhoneNumber] =
    useState("");
  const [numberOfBikes, setNumberOfBikes] = useState("");
  const [principalOfficerEmail, setPrincipalOfficerEmail] = useState("");
  const [principalOfficerAddress, setPrincipalOfficerAddress] = useState("");
  const [principalOfficerDesignation, setPrincipalOfficerDesignation] =
    useState("");

  // State variables for company account information
  const [companyAccountName, setCompanyAccountName] = useState("");
  const [companyAccountNumber, setCompanyAccountNumber] = useState("");
  const [companyBankName, setCompanyBankName] = useState("");
  const [companyAccountType, setCompanyAccountType] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    const requiredFields = [
      { field: companyName, label: "Company Name" },
      { field: companyPhoneNumber, label: "Company Phone Number" },
      { field: companyEmail, label: "Company Email" },
      { field: password, label: "Password" },
      { field: officeAddress, label: "Office Address" },
      { field: cityStateCountry, label: "City, State, and Country" },
      {
        field: companyRegistrationNumber,
        label: "Company Registration Number",
      },
      { field: numberOfBikes, label: "Number of Bikes" },
      { field: principalOfficerName, label: "Principal Officer Name" },
      {
        field: principalOfficerPhoneNumber,
        label: "Principal Officer Phone Number",
      },
      { field: principalOfficerEmail, label: "Principal Officer Email" },
      { field: principalOfficerAddress, label: "Principal Officer Address" },
      {
        field: principalOfficerDesignation,
        label: "Principal Officer Designation",
      },
      { field: companyAccountName, label: "Company Account Name" },
      { field: companyAccountNumber, label: "Company Account Number" },
      { field: companyBankName, label: "Company Bank Name" },
      { field: companyAccountType, label: "Company Account Type" },
      { field: companyRegistrationCertificate, label: "Company Certificate" },
      { field: bikeRegistrationEvidence, label: "Bike Registration Evidence" },
      { field: principalOfficerIdProof, label: "Principal Officer ID Proof" },
    ];

    const emptyFields = requiredFields.filter(({ field }) => !field);

    if (emptyFields.length > 0) {
      const emptyFieldsLabels = emptyFields
        .map(({ label }) => label)
        .join(", ");
      setError(`Please fill out all required fields: ${emptyFieldsLabels}`);
      return;
    }

    setLoading(true);
    try {
      // Create user account with email and password
      const { user } = await createUserWithEmailAndPassword(
        auth,
        companyEmail,
        password // You can set a default password or prompt the user to create one
      );

      // Store company registration data in Firestore
      const companyData = {
        password,
        companyName,
        companyPhoneNumber,
        companyEmail,
        officeAddress,
        cityStateCountry,
        companyRegistrationNumber,
        numberOfBikes,
        principalOfficerName,
        principalOfficerPhoneNumber,
        principalOfficerEmail,
        principalOfficerAddress,
        principalOfficerDesignation,
        companyAccountName,
        companyAccountNumber,
        companyBankName,
        companyAccountType,
        companyRegistrationCertificate,
        bikeRegistrationEvidence,
        principalOfficerIdProof,
      };

      await setDoc(doc(collection(db, "companies"), user.uid), companyData);
      console.log("Company registration data stored successfully!");
    } catch (error) {
      console.error("Error signing up:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  ////////////////////images.....................................
  const [companyRegistrationCertificate, setCompanyRegistrationCertificate] =
    useState(null);
  const [bikeRegistrationEvidence, setBikeRegistrationEvidence] =
    useState(null);
  const [principalOfficerIdProof, setPrincipalOfficerIdProof] = useState(null);
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
        setCompanyRegistrationCertificate(downloadURL);
        break;
      case 2:
        console.log("File type 2:", downloadURL);
        setBikeRegistrationEvidence(downloadURL);
        break;
      case 3:
        console.log("File type 3:", downloadURL);
        setPrincipalOfficerIdProof(downloadURL);
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
          {/* <CardHeader className="bg-transparent pb-5">

          </CardHeader> */}
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>REGISTER COMPANY</small>
            </div>
            <Form role="form">
              {/* Company Information Fields */}
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-shop" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Company Name"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
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
                    placeholder="Company Phone Number"
                    type="tel"
                    value={companyPhoneNumber}
                    onChange={(e) => setCompanyPhoneNumber(e.target.value)}
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
                    placeholder="Company Email"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
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
                      <i className="ni ni-square-pin" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Office Address"
                    type="text"
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-world-2" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="City, State, and Country"
                    type="text"
                    value={cityStateCountry}
                    onChange={(e) => setCityStateCountry(e.target.value)}
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
                    placeholder="Company Registration Number"
                    type="text"
                    value={companyRegistrationNumber}
                    onChange={(e) =>
                      setCompanyRegistrationNumber(e.target.value)
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
                    placeholder="Number of Bikes"
                    type="number"
                    value={numberOfBikes}
                    onChange={(e) => setNumberOfBikes(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              {/* Principal Officer Information Fields */}
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Principal Officer Name"
                    type="text"
                    value={principalOfficerName}
                    onChange={(e) => setPrincipalOfficerName(e.target.value)}
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
                    placeholder="Principal Officer Phone Number"
                    type="tel"
                    value={principalOfficerPhoneNumber}
                    onChange={(e) =>
                      setPrincipalOfficerPhoneNumber(e.target.value)
                    }
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
                    placeholder="Principal Officer Email"
                    type="email"
                    value={principalOfficerEmail}
                    onChange={(e) => setPrincipalOfficerEmail(e.target.value)}
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
                    placeholder="Principal Officer Address"
                    type="text"
                    value={principalOfficerAddress}
                    onChange={(e) => setPrincipalOfficerAddress(e.target.value)}
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
                    placeholder="Principal Officer Designation"
                    type="text"
                    value={principalOfficerDesignation}
                    onChange={(e) =>
                      setPrincipalOfficerDesignation(e.target.value)
                    }
                  />
                </InputGroup>
              </FormGroup>
              {/* Company Account Information Fields */}
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Company Account Name"
                    type="text"
                    value={companyAccountName}
                    onChange={(e) => setCompanyAccountName(e.target.value)}
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
                    placeholder="Company Account Number"
                    type="text"
                    value={companyAccountNumber}
                    onChange={(e) => setCompanyAccountNumber(e.target.value)}
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
                    placeholder="Company Bank Name"
                    type="text"
                    value={companyBankName}
                    onChange={(e) => setCompanyBankName(e.target.value)}
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
                    placeholder="Company Account Type"
                    type="text"
                    value={companyAccountType}
                    onChange={(e) => setCompanyAccountType(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>

              {/* 
              const [companyRegistrationCertificate, setCompanyRegistrationCertificate] =
    useState(null);
  const [bikeRegistrationEvidence, setBikeRegistrationEvidence] =
    useState(null);
  const [principalOfficerIdProof, setPrincipalOfficerIdProof] = useState(null); */}
              <FormGroup>
                <label htmlFor="fileUpload" className="form-label">
                  company Registration Certificate
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
                  bike Registration Evidence
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
                  principal Officer Id Proof
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
              {/* FILE UPLOAD ENDING */}
              {/* FILE UPLOAD ENDING */}
              {/* FILE UPLOAD ENDING */}
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
                  {loading ? "Loading..." : "Register Company"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default RiderReg2;
