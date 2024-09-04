
import React from 'react'
import {
  Container,
  Row,
  CardHeader,
  Card,
  Table,
  Dropdown,
  CardBody,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Progress,
} from 'reactstrap';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { db, auth, storage } from "../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "Globalstate.js";
import { v4 as uuid } from "uuid"
import Swal from "sweetalert2";
import { useState, useContext, useEffect } from "react";
import { CollectionReference } from "firebase/firestore";
import { getFirestore, collection, query, where, getDoc, getDocs, setDoc, doc } from "firebase/firestore";




const CompDash = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  // State variables for personal information
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
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
  // State variables for images
  const [businessRegistrationImage, setBusinessRegistrationImage] =
    useState("");
  const [bikeRegistrationImage, setBikeRegistrationImage] = useState("");
  const [passportImage, setPassportImage] = useState("");
  const [idImage, setIdImage] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [{ userdetails, compriddetails, loggedin, tradingpair, distance }, dispatch] = useContext(GlobalContext);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  // const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalPopOpen, setModalPopOpen] = useState(false);
  // const toggle = () => setModal(!modal);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const toggler = () => setModal(!modal);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  const toggleModalPop = () => {
    setModalPopOpen(!modalPopOpen);
     };


  // const toggleInfoModal = () => {
  //   setInfoModalOpen(!infoModalOpen);



  // };

  // const handleItemClick = (item) => {
  //   setSelectedItem(item);
  //   console.log("Item check 3", selectedItem)
  //   toggleInfoModal();
  //   console.log("Item check 2", infoModalOpen)
  // };
  // State to toggle password visibility for pass

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
    // Upload the file to Firebase Storage
    const storageRef = ref(storage, `files/${selectedFile.name}`);
    await uploadBytes(storageRef, selectedFile);
    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(storageRef);
    switch (filetype) {
      case 1:
        setBusinessRegistrationImage(downloadURL);
        break;
      case 2:
        setBikeRegistrationImage(downloadURL);
        break;
      case 3:
        setPassportImage(downloadURL);
        break;
      case 4:
        setIdImage(downloadURL);
        break;
      default:
        console.log("Unknown file type:", downloadURL);
    }
    setFileLoading(false);
  };
  console.log('current step is ', currentStep);
  const handleNext = async (e) => {
    if (currentStep == 1) {
      e.preventDefault();
      const requiredFields = [
        { field: firstName, label: "First Name" },
        { field: surName, label: "Last Name" },
        { field: dateOfBirth, label: "Date of Birth" },
        { field: email, label: "Email" },
        { field: password, label: "Password" },
        { field: confirmPassword, label: "Confirm Password" },
        { field: phoneNumber, label: "Phone Number" },
        { field: homeAddress, label: "Home Address" },
      ];
      // console.log('done');
      
      const emptyFields = requiredFields.filter(({ field }) => !field);
      // console.log(emptyFields);
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
    }
    
    if (currentStep == 2) {
      console.log("hi");
      const requiredFields = [
        { field: bikeRegistrationNumber, label: "Bike Registration Number" },
        { field: bikeRegistrationType, label: "Bike Registration Type" },
        { field: bikeRegistrationImage, label: "Bike Registration" },
        { field: passportImage, label: "Passport Image" },
      ];

      const emptyFields = requiredFields.filter(({ field }) => !field);
      // console.log(emptyFields);
      if (emptyFields.length > 0) {
        const emptyFieldsLabels = emptyFields
          .map(({ label }) => label)
          .join(", ");
        setError(`Please fill out all required fields: ${emptyFieldsLabels}`);
        return;
      }
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };
  
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // implementing userID generator
  const generateUserId = async (dispatch) => {
    let uniqueId;
    const dbRef = collection(db, "companyriderslog");
    try {
      do {
        let unique_id = uuid();
        uniqueId = `STR${unique_id.slice(0, 5)}`;

        const querySnapshot = await getDocs(query(dbRef, where("uniqueId", "==", uniqueId)));
        if (querySnapshot.empty) {
          console.log(uniqueId)
          break;
        }

      } while (true);
      ;
      console.log(uniqueId)
    } catch (error) {
      console.error("Error generating unique ID:", error);
    }
    return uniqueId;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const requiredFields = [
    // MOVE THIS VALIDATION TO STEP 1 AFTER CLICKING NEXT 
      // { field: firstName, label: "First Name" },
      // { field: surName, label: "Last Name" },
      // { field: dateOfBirth, label: "Date of Birth" },
      // { field: email, label: "Email" },
      // { field: password, label: "Password" },
      // { field: confirmPassword, label: "Confirm Password" },
      // { field: phoneNumber, label: "Phone Number" },
      // Added confirm password to required fields and removed Gender

      // { field: homeAddress, label: "Home Address" },
      // { field: businessName, label: "Business Name" },
      // { field: businessAddress, label: "Business Address" },
      // { field: businessRegistrationNumber, label: "Business Registration Number" },

      // { field: bikeRegistrationNumber, label: "Bike Registration Number" },
      // { field: bikeRegistrationType, label: "Bike Registration Type" },
      { field: kinFullName, label: "Next of Kin Full Name" },
      { field: kinPhoneNumber, label: "Next of Kin Phone Number" },
      { field: kinRelationship, label: "Next of Kin Relationship" },
      { field: kinAddress, label: "Next of Kin Address" },

      // { field: accountName, label: "Account Name" },
      // { field: accountNumber, label: "Account Number" },
      // { field: bankName, label: "Bank Name" },
      // { field: accountType, label: "Account Type" },
      // {
      //   field: businessRegistrationImage,
      //   label: "Business Registration Image",
      // },


      // { field: bikeRegistrationImage, label: "Bike Registration" },
      // { field: passportImage, label: "Passport Image" },
      // { field: idImage, label: "ID Image" },
    ];

    const emptyFields = requiredFields.filter(({ field }) => !field);
    if (emptyFields.length > 0) {
      const emptyFieldsLabels = emptyFields.map(({ label }) => label).join(", ");
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

      // Create user account with email and password
      // Handling email verification for riders
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(user);

      // $$$$$ Sign out the user immediately after sending the verification email
      const compRideruniqueId = await generateUserId();
      console.log("uID2:" + compRideruniqueId)

      // dispatch({ type: 'uniqueId', payload: uniqueId })
      const uniqueId = userdetails.uniqueId
      
      // Store user registration data in Firestore
      //  Note UniqueId here refers to CompanyID and is common amongst all riders.
      const userData = {
        uniqueId,
        compRideruniqueId,
        firstName,
        surName,
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
        businessRegistrationImage,
        bikeRegistrationImage,
        passportImage,
        idImage,
        dateCreated: serverTimestamp(),
      };

      await setDoc(doc(collection(db, "companyriderslog"), user.uid), userData);

      


      // added message
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "A verification email has been sent to rider's email address.",
      });


      setTimeout(() => {
        setLoading(false);
        setModalOpen(false); // Close the modal on sign-up
      }, 2000);


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


  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

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

  const setridersdetails = (data) => {
    dispatch({ type: "setcompriddetails", snippet: data });
  };

  // console.log("Check G: ", userdetails)
  ///////////////////Logic for mapping riders based on companyID////////////
  
  useEffect(() => {

    const fetchData = async () => {
      try {

        if (userdetails) {
          const db = getFirestore();
          const companyRef = collection(db, "companyriderslog");
          const q = query(companyRef, where("uniqueId", "==", userdetails.uniqueId));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const ridersList = [];
            querySnapshot.forEach(doc => {
              const data = doc.data();
              ridersList.push(data);
              console.log("Document Data:", data);
            });
            setridersdetails(ridersList);
          } else {
            console.log("No documents found with the specified uniqueId.");
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };
    fetchData();
  }, [userdetails]);




  // console.log("Check F: ", compriddetails)




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
      <div className="header pt-7 pt-lg-8 d-flex align-items-center">
        {/* Mask */}
        <span className="mask pt-9 bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="mt-" fluid>
          <Row className="mt-5">
            <div className="col">
              <Card className="bg-default shadow">
                <CardHeader className="bg-transparent border-0">
                  {userdetails ? (
                    <div className="d-flex justify-content-between">
                      <h4 className="text-white">
                        Company Name: {userdetails.compName}
                      </h4>
                      <Button
                        color="primary"
                        onClick={toggleModal}
                        className="right text-white"
                      >
                        ➕Add Rider
                      </Button>
                    </div>
                  ) : (
                    <div className="text-white">Loading company details...</div>
                  )}
                </CardHeader>
                <CardBody>
                  <h3 className="text-white mb-0">
                    My Company Riders Profiles
                  </h3>
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </div>

      <Container className="" fluid>
        <style>
          {`

          .dots {
            
            border-radius: 50%;
            height: 20px;
            width: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            cursor : pointer;

          }
          .dots:hover {
             background-color : #7abfdf;
          }


          .table-container {
            overflow: visible;
          }
          .position-static {
            position: static !important;
          }
          .kebab-menu {
            cursor: pointer;
            transition: color 0.3s;
          }
          .kebab-menu:hover {
            color: blue;
          }

        `}
        </style>
        <Row className="">
          <div className="col">
            <Card className=" shadow">
              <Table className="align-items-center  table-flush" responsive>
                {" "}
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">S/N</th>
                    <th scope="col">rider</th>
                    <th scope="col">rider's Id</th>
                    <th scope="col">Status</th>
                    <th scope="col">Bal</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody className="">
                  {compriddetails.length > 0 ? (
                    compriddetails.map((rider, index) => (
                      // <tr key={index}>
                      // <th scope="col">{index + 1}</th>
                      // <th scope="col">{rider.firstName} {rider.surName} </th>
                      // <th scope="col">{rider.compRideruniqueId} </th>
                      // <th scope="col">active</th>
                      // <th scope="col">{rider.RiderBal}</th>

                      <>
                        <tr key={index}>
                          {/* <div className="bg-red-500 h-[5rem] w-[5rem]"></div> */}
                          <th scope="col">{index + 1}</th>
                          <th scope="col">
                            {rider.firstName} {rider.surName}{" "}
                          </th>
                          <th scope="col">{rider.compRideruniqueId} </th>
                          <th scope="col">active</th>
                          <th scope="col">{rider.RiderBal}</th>
                          <th scope="col">
                            <div
                              className=" dots bg-[#7abfdf] "
                              onClick={toggleModalPop}
                            >
                              deactivate ...
                            </div>
                            <Modal
                              isOpen={modalPopOpen}
                              toggle={toggleModalPop}
                            >
                              <ModalHeader toggle={toggleModalPop}>
                                Modal title
                              </ModalHeader>
                              <ModalBody>
                                <div>
                                  <div className="">
                                    <div
                                      className="flex"
                                      style={{ display: "flex", gap: "5px" }}
                                    >
                                      <h3>NAME:</h3>
                                    </div>
                                  </div>
                                </div>
                              </ModalBody>
                            </Modal>
                          </th>
                        </tr>
                      </>
                    ))
                  ) : (
                    <tr>
                      <th scope="col">---</th>
                      <th scope="col">---</th>
                      <th scope="col">--- </th>
                      <th scope="col">---</th>
                      <th scope="col">---</th>
                      <th scope="col">
                        <div className="position-static">...</div>
                      </th>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>

        {/* Company registers it's riders here */}
        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>
            Company Rider Registration Form
          </ModalHeader>
          <ModalBody>
            <Col lg="" md="8">
              <Card className="bg-secondary shadow border-0">
                <CardBody className="px-lg-5 py-lg-5">
                  {/* <div className="text-center text-muted mb-4">
                    <small>REGISTER AS INDEPENDENT RIDER</small>
                  </div> */}
                  <Progress value={(currentStep / 3) * 100} className="mb-4" />
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
                              placeholder="first Name"
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
                                <i className="ni ni-hat-3" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Last name"
                              type="text"
                              value={surName}
                              onChange={(e) => setSurName(e.target.value)}
                            />
                          </InputGroup>
                        </FormGroup>
                        
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3 bg-white">
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
                            <InputGroupAddon addonType="append">
                              <small
                                className="btn-sm my-auto"
                              >
                               Date of Birth
                              </small>
                            </InputGroupAddon>
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
                              type={
                                passwordConfirmVisible ? "text" : "password"
                              }
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
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
                                <i className="ni ni-delivery-fast" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Bike Registration Number"
                              type="text"
                              value={bikeRegistrationNumber}
                              onChange={(e) =>
                                setBikeRegistrationNumber(e.target.value)
                              }
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
                              onChange={(e) =>
                                setBikeRegistrationType(e.target.value)
                              }
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <label htmlFor="fileUpload" className="form-label">
                            passport Image
                          </label>
                          <InputGroup className="input-group-alternative mb-3">
                            <Input
                              id="fileUpload"
                              placeholder="Company Account Type"
                              type="file"
                              onChange={(e) => handleFileUpload(e, 3)}
                            />
                          </InputGroup>
                          {fileLoading && (
                            <p>
                              <b>Uploading...please wait</b>
                            </p>
                          )}
                        </FormGroup>
                        <FormGroup>
                          <label htmlFor="fileUpload" className="form-label">
                            Bike registration Image
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
                              onChange={(e) =>
                                setKinPhoneNumber(e.target.value)
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
                              onChange={(e) =>
                                setKinRelationship(e.target.value)
                              }
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
                    {error && (
                      <div className="text-center">
                        <small className="text-danger">{error}</small>
                      </div>
                    )}
                    <div className="text-center">
                      {currentStep !== 1 && (
                        <Button
                          onClick={handlePrev}
                          color="primary"
                          className="mt-4"
                        >
                          Previous
                        </Button>
                      )}
                      {currentStep !== 3 ? (
                        <Button
                          onClick={handleNext}
                          color="primary"
                          className="mt-4"
                        >
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
          </ModalBody>
          {/* <ModalFooter>
            <Button color="primary" onClick={toggleModal}>Submit</Button>
            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
          </ModalFooter> */}
        </Modal>
      </Container>
    </>
  );
};
export default CompDash




































// import React, { useState, useEffect, useContext } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardHeader,
//   CardBody,
//   Table,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Progress,
//   Form,
//   FormGroup,
//   InputGroup,
//   InputGroupAddon,
//   InputGroupText,
//   Input,
//   Alert,
// } from "reactstrap";

// import { GlobalContext } from "Globalstate.js";
// import { db } from "../../firebase";
// import { getFirestore ,collection, query, where, getDocs } from "firebase/firestore";
// import Swal from "sweetalert2";

// const CompDash = () => {
//   const [{ userdetails, loggedin, tradingpair, distance }, dispatch] = useContext(GlobalContext);
//   const [items, setItems] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalPopOpen, setModalPopOpen] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [firstName, setFirstName] = useState("");
//   const [surName, setSurName] = useState("");
//   const [dateOfBirth, setDateOfBirth] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [compRideruniqueId, setCompRideruniqueId] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [address, setAddress] = useState("");
//   const [RiderBal, setRiderBal] = useState("");
//   const [accountNumber, setAccountNumber] = useState("");
//   const [bankName, setBankName] = useState("");
//   const [accountHolderName, setAccountHolderName] = useState("");
//   const [licenseNumber, setLicenseNumber] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const toggleModal = () => {
//     setModalOpen(!modalOpen);
//   };

//   const toggleModalPop = () => {
//     setModalPopOpen(!modalPopOpen);
//   };

//   const handleSignUp = async () => {
//     setLoading(true);
//     try {
//       // Code for handling sign up...
//       setLoading(false);
//       Swal.fire({
//         title: 'Success',
//         text: 'User registration successful! Please check your email to verify your account.',
//         icon: 'success',
//         confirmButtonText: 'OK',
//       }).then(() => {
//         toggleModal();
//       });
//     } catch (error) {
//       console.error("Failed to create an account:", error);
//       setError(`Failed to create an account. ${error.message}`);
//     }
//     setLoading(false);
//   };

//   const handleNext = () => {
//     if (currentStep < 3) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };


// // 






//   // Get details that match the username

//   useEffect(() => {
//     if (!userdetails || !userdetails.uniqueId) {
//       console.error("userdetails is undefined or does not have a uniqueId.");
//       return;
//     }

//   //   const fetchData = async () => {
//   //     try {
//   //       const q = query(collection(db, "companyriderslog"), where("uniqueId", "==", userdetails.uniqueId));
//   //       const querySnapshot = await getDocs(q);
//   //       const fetchedItems = [];
//   //       querySnapshot.forEach((doc) => {
//   //         fetchedItems.push(doc.data());
//   //       });

//   //       setItems(fetchedItems);
//   //     } catch (error) {
//   //       console.error("Error fetching data:", error);
//   //     }
//   //   };

//   //   fetchData();
//   // }, [userdetails]);

//   const fetchRidersAndOrders = async () => {
//     try {
//       // Fetch riders
//       const ridersQuery = query(collection(db, "companyriderslog"), where("uniqueId", "==", userdetails.uniqueId));
//       const ridersSnapshot = await getDocs(ridersQuery);
//       const fetchedRiders = [];
//       ridersSnapshot.forEach((doc) => {
//         const riderData = doc.data();
//         fetchedRiders.push(riderData);
//       });

//       setItems(fetchedRiders);

//       // Fetch orders for each rider
//       const fetchedOrders = [];
//       for (const rider of fetchedRiders) {
//         const ordersQuery = query(collection(db, "order"), where("uniqueId", "==", rider.compRideruniqueId));
//         const ordersSnapshot = await getDocs(ordersQuery);
//         ordersSnapshot.forEach((doc) => {
//           const orderData = doc.data();
//           fetchedOrders.push({ rider, orderData }); 
//           // Store the rider and order data together
//         });
//       }

//       setOrders(fetchedOrders);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   fetchRidersAndOrders();
// }, [userdetails]);




//   return (
//     <>
//       <div className="header pt-7 pt-lg-8 d-flex align-items-center">
//         {/* Mask */}
//         <span className="mask pt-9 bg-gradient-default opacity-8" />
//         {/* Header container */}
//         <Container className="mt-" fluid>
//           <Row className="mt-5">
//             <div className="col">
//               <Card className="bg-default shadow">
//                 <CardHeader className="bg-transparent border-0">
//                   {userdetails ? (
//                     <div className="d-flex justify-content-between">
//                       <h4 className="text-white">Company Name: {userdetails.compName}</h4>
//                       <Button color="primary" onClick={toggleModal} className="right text-white">
//                         ➕Add Rider
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="text-white">Loading company details...</div>
//                   )}
//                 </CardHeader>
//                 <CardBody>
//                   <h3 className="text-white mb-0">My Company Riders Profiles</h3>
//                 </CardBody>
//               </Card>
//             </div>
//           </Row>
//         </Container>
//       </div>
//       <Container className="" fluid>
//         <style>
//           {`
//           .dots {
            
//             border-radius: 50%;
//             height: 20px;
//             width: 20px;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             font-weight: bold;
//             cursor : pointer;
//           }
//             .dots:hover {
//             background-color : #7abfdf;
//             }
//           .table-container {
//             overflow: visible;
//           }
//           .position-static {
//             position: static !important;
//           }
//           .kebab-menu {
//             cursor: pointer;
//             transition: color 0.3s;
//           }
//           .kebab-menu:hover {
//             color: blue;
//           }
//         `}
//         </style>
//         <Row className="">
//           <div className="col">
//             <Card className=" shadow">
//               <Table className="align-items-center  table-flush" responsive>
//                 <thead className="thead-dark">
//                   <tr>
//                     <th scope="col">S/N</th>
//                     <th scope="col">rider</th>
//                     <th scope="col">rider's Id</th>
//                     <th scope="col">Status</th>
//                     <th scope="col">Bal</th>
//                     <th scope="col"></th>
//                   </tr>
//                 </thead>
//                 <tbody className="">
//                   {items.length > 0 ? (
//                     items.map((rider, index) => (
//                       <tr key={index}>
//                         <th scope="col">{index + 1}</th>
//                         <th scope="col">{rider.firstName} {rider.surName}</th>
//                         <th scope="col">{rider.compRideruniqueId}</th>
//                         <th scope="col">active</th>
//                         <th scope="col">{rider.RiderBal}</th>
//                         <th scope="col">

//                           <div className=" dots bg-[#7abfdf] " onClick={toggleModalPop}>...</div>

//                           <Modal isOpen={modalPopOpen} toggle={toggleModalPop}>
//                             <ModalHeader toggle={toggleModalPop}>Modal title</ModalHeader>
//                             <ModalBody>
//                               <div >
//                                 <div className="">
//                                   <div className="flex" style={{ display: 'flex', gap: '5px' }} >

//                                     <h3>NAME:</h3>
//                                     <span>  {rider.firstName} {rider.surName}</span>
//                                   </div>
//                                   <div className="flex" style={{ display: 'flex', gap: '5px' }} >

//                                     <h3>UNIQUE ID:</h3>
//                                     <span>  {rider.firstName} {rider.surName}</span>
//                                   </div>
//                                 </div>
//                               </div>
//                               <ul>
//                                   {orders
//                                     .filter((order) => order.rider.compRideruniqueId === rider.compRideruniqueId)
//                                     .map((order, i) => (
//                                       <li key={i}>
//                                         <strong>Order ID:</strong> {order.orderData.orderId} <br />
//                                         <strong>Order Details:</strong> {JSON.stringify(order.orderData)}
//                                       </li>
//                                     ))}
//                                 </ul>
//                             </ModalBody>
//                             <ModalFooter>
//                               <Button color="secondary" onClick={toggleModalPop}>Close</Button>
//                             </ModalFooter>
//                           </Modal>
//                         </th>
//                       </tr>
//                     ))
//                   ) : ( 
//                     <tr>
//                       <th scope="col">---</th>
//                       <th scope="col">---</th>
//                       <th scope="col">---</th>
//                       <th scope="col">---</th>
//                       <th scope="col">---</th>
//                       <th scope="col">---</th>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </Card>
//           </div>
//         </Row>
//         <Modal isOpen={modalOpen} toggle={toggleModal}>
//           <ModalHeader toggle={toggleModal}>Company Rider Registration Form</ModalHeader>
//           <ModalBody>
//             <Col lg="" md="8">
//               <Card className="bg-secondary shadow border-0">
//                 <CardBody className="px-lg-5 py-lg-5">
//                   <Progress value={(currentStep / 3) * 100} className="mb-4" />
//                   <Form role="form">
//                     {currentStep === 1 && (
//                       <>
//                         <FormGroup>
//                           <InputGroup className="input-group-alternative mb-3">
//                             <InputGroupAddon addonType="prepend">
//                               <InputGroupText>
//                                 <i className="ni ni-hat-3" />
//                               </InputGroupText>
//                             </InputGroupAddon>
//                             <Input
//                               placeholder="First Name"
//                               type="text"
//                               value={firstName}
//                               onChange={(e) => setFirstName(e.target.value)}
//                             />
//                           </InputGroup>
//                         </FormGroup>
//                         <FormGroup>
//                           <InputGroup className="input-group-alternative mb-3">
//                             <InputGroupAddon addonType="prepend">
//                               <InputGroupText>
//                                 <i className="ni ni-hat-3" />
//                               </InputGroupText>
//                             </InputGroupAddon>
//                             <Input
//                               placeholder="Last Name"
//                               type="text"
//                               value={surName}
//                               onChange={(e) => setSurName(e.target.value)}
//                             />
//                           </InputGroup>
//                         </FormGroup>
//                         <FormGroup>
//                           <InputGroup className="input-group-alternative mb-3">
//                             <InputGroupAddon addonType="prepend">
//                               <InputGroupText>
//                                 <i className="ni ni-calendar-grid-58" />
//                               </InputGroupText>
//                             </InputGroupAddon>
//                             <Input
//                               placeholder="Date of Birth"
//                               type="date"
//                               value={dateOfBirth}
//                               onChange={(e) => setDateOfBirth(e.target.value)}
//                             />
//                           </InputGroup>
//                         </FormGroup>
//                         <FormGroup>
//                           <InputGroup className="input-group-alternative mb-3">
//                             <InputGroupAddon addonType="prepend">
//                               <InputGroupText>
//                                 <i className="ni ni-email-83" />
//                               </InputGroupText>
//                             </InputGroupAddon>
//                             <Input
//                               placeholder="Email"
//                               type="email"
//                               value={email}
//                               onChange={(e) => setEmail(e.target.value)}
//                             />
//                           </InputGroup>
//                         </FormGroup>
//                         <FormGroup>
//                           <InputGroup className="input-group-alternative mb-3">
//                             <InputGroupAddon addonType="prepend">
//                               <InputGroupText>
//                                 <i className="ni ni-lock-circle-open" />
//                               </InputGroupText>
//                             </InputGroupAddon>
//                             <Input
//                               placeholder="Password"
//                               type="password"
//                               value={password}
//                               onChange={(e) => setPassword(e.target.value)}
//                             />
//                           </InputGroup>
//                         </FormGroup>
//                       </>
//                     )}
//                     {currentStep === 2 && (
//                       <>
//                         <FormGroup>
//                           <InputGroup className="input-group-alternative mb-3">
//                             <InputGroupAddon addonType="prepend">
//                               <InputGroupText>
//                                 <i className="ni ni-circle-08" />
//                               </InputGroupText>
//                             </InputGroupAddon>
//                             <Input
//                               placeholder="Company Rider unique Id"
//                               type="text"
//                               value={compRideruniqueId}
//                               onChange={(e) => setCompRideruniqueId(e.target.value)}
//                             />
//                           </InputGroup>
//                         </FormGroup>
//                         <FormGroup>
//                           <InputGroup className="input-group-alternative mb-3">
//                             <InputGroupAddon addonType="prepend">
//                               <InputGroupText>
//                                 <i className="ni ni-mobile-button" />
//                               </InputGroupText>
//                             </InputGroupAddon>
//                             <Input
//                               placeholder="Phone Number"
//                               type="text"
//                               value={phoneNumber}
//                               onChange={(e) => setPhoneNumber(e.target.value)}
//                             />
//                           </InputGroup>
//                         </FormGroup>
//                         <FormGroup>
//                           <InputGroup className="input-group-alternative mb-3">
//                             <InputGroupAddon addonType="prepend">
//                               <InputGroupText>
//                                 <i className="ni ni-hat-3" />
//                               </InputGroupText>
//                             </InputGroupAddon>
//                             <Input
//                               placeholder="Residential Address"
//                               type="text"
//                               value={address}
//                               onChange={(e) => setAddress(e.target.value)}
//                             />
//                           </InputGroup>
//                         </FormGroup>
//                         <FormGroup>
//                           <InputGroup className="input-group-alternative mb-3">
//                             <InputGroupAddon addonType="prepend">
//                               <InputGroupText>
//                                 <i className="ni ni-hat-3" />
//                               </InputGroupText>
//                             </InputGroupAddon>
//                             <Input
//                               placeholder="Rider Balance"
//                               type="number"
//                               value={RiderBal}
//                               onChange={(e) => setRiderBal(e.target.value)}
//                             />
//                           </InputGroup>
//                         </FormGroup>
//                       </>
//                     )}
//                     {currentStep === 3 && (
//                       <>
//                         <FormGroup>
//                           <InputGroup className="input-group-alternative mb-3">
//                             <InputGroupAddon addonType="prepend">
//                               <InputGroupText>
//                                 <i className="ni ni-credit-card" />
//                               </InputGroupText>
//                             </InputGroupAddon>
//                             <Input
//                               placeholder="Account Number"
//                               type="text"
//                               value={accountNumber}
//                               onChange={(e) => setAccountNumber(e.target.value)}
//                             />
//                           </InputGroup>
//                         </FormGroup>
//                         <FormGroup>
//                           <InputGroup className="input-group-alternative mb-3">
//                             <InputGroupAddon addonType="prepend">
//                               <InputGroupText>
//                                 <i className="ni ni-building" />
//                               </InputGroupText>
//                             </InputGroupAddon>
//                             <Input
//                               placeholder="Bank Name"
//                               type="text"
//                               value={bankName}
//                               onChange={(e) => setBankName(e.target.value)}
//                             />
//                           </InputGroup>
//                         </FormGroup>
//                         <FormGroup>
//                           <InputGroup className="input-group-alternative mb-3">
//                             <InputGroupAddon addonType="prepend">
//                               <InputGroupText>
//                                 <i className="ni ni-circle-08" />
//                               </InputGroupText>
//                             </InputGroupAddon>
//                             <Input
//                               placeholder="Account Holder's Name"
//                               type="text"
//                               value={accountHolderName}
//                               onChange={(e) => setAccountHolderName(e.target.value)}
//                             />
//                           </InputGroup>
//                         </FormGroup>
//                         <FormGroup>
//                           <InputGroup className="input-group-alternative mb-3">
//                             <InputGroupAddon addonType="prepend">
//                               <InputGroupText>
//                                 <i className="ni ni-briefcase-24" />
//                               </InputGroupText>
//                             </InputGroupAddon>
//                             <Input
//                               placeholder="Rider's License Number"
//                               type="text"
//                               value={licenseNumber}
//                               onChange={(e) => setLicenseNumber(e.target.value)}
//                             />
//                           </InputGroup>
//                         </FormGroup>
//                       </>
//                     )}
//                     <div className="text-center">
//                       {currentStep > 1 && (
//                         <Button className="mt-4 mr-2" color="primary" type="button" onClick={handlePrevious}>
//                           Previous
//                         </Button>
//                       )}
//                       {currentStep < 3 && (
//                         <Button className="mt-4" color="primary" type="button" onClick={handleNext}>
//                           Next
//                         </Button>
//                       )}
//                       {currentStep === 3 && (
//                         <Button className="mt-4" color="primary" type="button" onClick={handleSignUp}>
//                           {loading ? "Signing Up..." : "Sign Up"}
//                         </Button>
//                       )}
//                     </div>
//                     {error && (
//                       <Alert color="danger" className="mt-3">
//                         {error}
//                       </Alert>
//                     )}
//                   </Form>
//                 </CardBody>
//               </Card>
//             </Col>
//           </ModalBody>
//         </Modal>
//       </Container>
//     </>
//   );
// };

// export default CompDash;
