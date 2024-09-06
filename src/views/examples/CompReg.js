import React, { useState } from "react";
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth, storage } from "../../firebase";
import Swal from "sweetalert2";
import { v4 as uuid } from "uuid";

const CompReg = () => {
  const navigate = useNavigate();

  const [compName, setCompName] = useState("");
  const [email, setEmail] = useState("");
  const [compPhone, setCompPhone] = useState("");
  const [compAdminFName, setCompAdminFName] = useState("");
  const [compAdminLName, setCompAdminLName] = useState("");
  const [compAdminAddress, setCompAdminAddress] = useState("");
  const [compAdminRole, setCompAdminRole] = useState("");
  const [compAccountName, setCompAccountName] = useState("");
  const [compAccountType, setCompAccountType] = useState("");
  const [compAccountNumber, setCompAccountNumber] = useState("");
  const [compBankName, setCompBankName] = useState("");
  const [compAddress, setCompAddress] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [fileLoading, setFileLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [businessRegistrationImage, setBusinessRegistrationImage] =
    useState("");
  const [profileImage, setProfileImage] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordConfirmVisibility = () => {
    setPasswordConfirmVisible(!passwordConfirmVisible);
  };

  const handleFileUpload = async (e, filetype) => {
    setFileLoading(true);
    const selectedFile = e.target.files[0];
    // Check file size
    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("File size exceeds 4MB limit.");
      setFileLoading(false);
      return;
    }

    const storageRef = ref(storage, `files/${selectedFile.name}`);
    await uploadBytes(storageRef, selectedFile);

    const downloadURL = await getDownloadURL(storageRef);
    switch (filetype) {
      case 1:
        setBusinessRegistrationImage(downloadURL);
        break;
      case 2:
        setProfileImage(downloadURL);
        break;
      default:
        console.log("Unknown file type:", downloadURL);
    }
    setFileLoading(false);
  };

  const handleNext = () => {
    if (currentStep == 1) {
      const requiredFields = [
        { field: compName, label: "Company Name" },
        { field: compPhone, label: "Company Phone" },
        { field: email, label: "Email" },
        { field: compAddress, label: "Company Office Address" },
        { field: password, label: "Password" },
        { field: confirmPassword, label: "Confirm Password" },
        { field: businessRegistrationImage, label: "CAC Reg. Image" },
        ];
        
        const emptyFields = requiredFields.filter(({ field }) => !field);
        if (emptyFields.length > 0) {
          const emptyFieldsLabels = emptyFields
            .map(({ label }) => label)
            .join(", ");
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
        // setLoading(true);
    }

    if (currentStep == 2) {
      const requiredFields = [
        { field: compAdminFName, label: "First Name" },
        { field: compAdminLName, label: "Last Name" },
        { field: compAdminAddress, label: "Admin Address" },
        { field: compAdminRole, label: "AdminRole" },
        { field: profileImage, label: "Profile picture" },
        ];
        
        const emptyFields = requiredFields.filter(({ field }) => !field);
        if (emptyFields.length > 0) {
          const emptyFieldsLabels = emptyFields
            .map(({ label }) => label)
            .join(", ");
          setError(`Please fill out all required fields: ${emptyFieldsLabels}`);
          return;
        }

        // setLoading(true);
      }
    //   setLoading(false)
    setError("");
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const generateUserId = async (dispatch) => {
    let uniqueId;
    const dbRef = collection(db, "company");
    try {
      do {
        let unique_id = uuid();

        uniqueId = `STR${compName.slice(0, 3) + unique_id.slice(0, 3)}`;

        const querySnapshot = await getDocs(
          query(dbRef, where("uniqueId", "==", uniqueId))
        );
        if (querySnapshot.empty) {
          console.log(uniqueId);
          break;
        }
      } while (true);

      console.log(uniqueId);
    } catch (error) {
      console.error("Error generating unique ID:", error);
    }

    return uniqueId;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const requiredFields = [
      // { field: compAdminFName, label: "First Name" },
      // { field: compAdminLName, label: "Last Name" },
      // { field: compAdminAddress, label: "Admin Address" },
      // { field: compAdminRole, label: "AdminRole" },
      // { field: profileImage, label: "Profile picture" },

      // { field: compName, label: "Company Name" },
      // { field: compPhone, label: "Company Phone" },
      // { field: email, label: "Email" },
      // { field: compAddress, label: "Company Office Address" },
      // { field: password, label: "Password" },
      // { field: confirmPassword, label: "Confirm Password" },
      // { field: businessRegistrationImage, label: "CAC Reg. Image" },

      { field: compAccountName, label: "Company Account Name" },
      { field: compAccountNumber, label: "Company Account Number" },
      { field: compBankName, label: "Company Bank Number" },
      { field: compAccountType, label: "Company Account Type" },
    ];

    const emptyFields = requiredFields.filter(({ field }) => !field);
    if (emptyFields.length > 0) {
      const emptyFieldsLabels = emptyFields
        .map(({ label }) => label)
        .join(", ");
      setError(`Please fill out all required fields: ${emptyFieldsLabels}`);
      return;
    }
    // if (password !== confirmPassword) {
    //   setError("Passwords do not match");
    //   return;
    // }
    // if (password.length < 8) {
    //   setError("Password must be at least 8 characters long");
    //   return;
    // }
    // if (password.length > 100) {
    //   setError("Password must be less than 100 characters long");
    //   return;
    // }
    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uniqueId = await generateUserId();

      await sendEmailVerification(user);

      const userData = {
        compName,
        compAccountName,
        compPhone,
        compAccountNumber,
        email,
        compAdminRole,
        compAdminFName,
        compAdminLName,
        compAddress,
        compBankName,
        compAdminAddress,
        compAccountType,
        businessRegistrationImage,
        profileImage,
        uniqueId,
        dateCreated: serverTimestamp(),
        compBal: 0,
      };

      await setDoc(doc(collection(db, "company"), user.uid), userData);

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "A verification email has been sent. Please check your inbox.",
      });

      navigate("/auth/login");
    } catch (error) {
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

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <b>REGISTER AS A COMPANY</b>
            </div>

            <Progress value={(currentStep / 3) * 100} className="mb-4" />

            <Form role="form">
              {currentStep === 1 && (
                <>
                  {/* Company Name */}
                  <div className="text-center text-muted mb-4">
                    <small>COMPANY DETAILS</small>
                  </div>
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-hat-3" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Company Name"
                        type="text"
                        value={compName}
                        onChange={(e) => setCompName(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                  {/* Company phone */}
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-mobile-button" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Office Phone"
                        invalid
                        type="tel"
                        value={compPhone}
                        onChange={(e) => setCompPhone(e.target.value)}
                        valid
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* Company Email */}

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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* Head office address */}

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
                        value={compAddress}
                        onChange={(e) => setCompAddress(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* Password */}
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
                          {
                            <i
                              className={
                                passwordVisible
                                  ? "fa fa-eye-slash"
                                  : "fa fa-eye"
                              }
                            />
                          }
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>

                  {/* Confirm password */}

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
                          {
                            <i
                              className={
                                passwordConfirmVisible
                                  ? "fa fa-eye-slash"
                                  : "fa fa-eye"
                              }
                            />
                          }
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>

                  {/* CAC Registration form */}

                  <FormGroup>
                    <label htmlFor="fileUpload" className="form-label">
                      CAC Registration Image
                    </label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="fileUpload"
                        type="file"
                        onChange={(e) => handleFileUpload(e, 1)}
                      />
                    </InputGroup>
                    {fileLoading && (
                      <p>
                        <b>Uploading...please wait</b>
                      </p>
                    )}
                  </FormGroup>
                </>
              )}

              {currentStep === 2 && (
                <>
                  {/* Company Admin Address  */}

                  <div className="text-center text-muted mb-4">
                    <small>DETAILS OF COMPANY'S ADMIN OFFICER</small>
                  </div>
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-hat-3" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="First name"
                        type="text"
                        value={compAdminFName}
                        onChange={(e) => setCompAdminFName(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* Company Admin Last name */}
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-hat-3" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Last name"
                        type="text"
                        value={compAdminLName}
                        onChange={(e) => setCompAdminLName(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* Office Admin Address */}
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-square-pin" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Admin address"
                        type="text"
                        value={compAdminAddress}
                        onChange={(e) => setCompAdminAddress(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* Designated role in company */}
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-hat-3" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Officer role"
                        type="text"
                        value={compAdminRole}
                        onChange={(e) => setCompAdminRole(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* Company Admin Passport */}
                  <FormGroup>
                    <label htmlFor="fileUpload" className="form-label">
                      Company Admin's Passport
                    </label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="fileUpload"
                        type="file"
                        onChange={(e) => handleFileUpload(e, 2)}
                      />
                    </InputGroup>
                    {fileLoading && (
                      <p>
                        <b>Uploading...please wait</b>
                      </p>
                    )}
                  </FormGroup>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="text-center text-muted mb-4">
                    <small>COMPANY ACCOUNT DETAILS</small>
                  </div>

                  {/* Company Account Name */}
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
                        value={compAccountName}
                        onChange={(e) => setCompAccountName(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* Compsny Account  number */}
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-credit-card" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder=" Company Account Number"
                        type="text"
                        value={compAccountNumber}
                        onChange={(e) => setCompAccountNumber(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* company bank name */}
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-bag-17" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Company Bank Name"
                        type="text"
                        value={compBankName}
                        onChange={(e) => setCompBankName(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* Company Account type */}
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-briefcase-24" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Company Account Type"
                        type="text"
                        value={compAccountType}
                        onChange={(e) => setCompAccountType(e.target.value)}
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
                {currentStep !== 3 ? (
                  <Button onClick={handleNext} color="primary" className="mt-4">
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSignUp}
                    color="primary"
                    className="mt-4"
                    disabled={loading}
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </Button>
                )}
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default CompReg;
