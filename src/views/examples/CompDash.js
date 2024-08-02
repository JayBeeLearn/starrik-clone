import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Alert,
} from "reactstrap";

import { GlobalContext } from "Globalstate.js";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";

const CompDash = () => {
  const [{ userdetails, loggedin, tradingpair, distance }, dispatch] = useContext(GlobalContext);
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPopOpen, setModalPopOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [compRideruniqueId, setCompRideruniqueId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [RiderBal, setRiderBal] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleModalPop = () => {
    setModalPopOpen(!modalPopOpen);
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      // Code for handling sign up...
      setLoading(false);
      Swal.fire({
        title: 'Success',
        text: 'User registration successful! Please check your email to verify your account.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        toggleModal();
      });
    } catch (error) {
      console.error("Failed to create an account:", error);
      setError(`Failed to create an account. ${error.message}`);
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    if (!userdetails || !userdetails.uniqueId) {
      console.error("userdetails is undefined or does not have a uniqueId.");
      return;
    }

    const fetchData = async () => {
      try {
        const q = query(collection(db, "companyriderslog"), where("uniqueId", "==", userdetails.uniqueId));
        const querySnapshot = await getDocs(q);
        const fetchedItems = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push(doc.data());
        });
        console.log("Fetched items:", fetchedItems); // Add logging here
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userdetails]);

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
                      <h4 className="text-white">Company Name: {userdetails.compName}</h4>
                      <Button color="primary" onClick={toggleModal} className="right text-white">
                        ➕Add Rider
                      </Button>
                    </div>
                  ) : (
                    <div className="text-white">Loading company details...</div>
                  )}
                </CardHeader>
                <CardBody>
                  <h3 className="text-white mb-0">My Company Riders Profiles</h3>
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
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">S/N</th>
                    <th scope="col">rider</th>
                    <th scope="col">rider's Id</th>
                    <th scope="col">Status</th>
                    <th scope="col">Bal</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody className="">
                  {items.length > 0 ? (
                    items.map((rider, index) => (
                      <tr key={index}>
                        <th scope="col">{index + 1}</th>
                        <th scope="col">{rider.firstName} {rider.surName}</th>
                        <th scope="col">{rider.compRideruniqueId}</th>
                        <th scope="col">active</th>
                        <th scope="col">{rider.RiderBal}</th>
                        <th scope="col">

                          <div className=" dots bg-[#7abfdf] " onClick={toggleModalPop}>...</div>

                          <Modal isOpen={modalPopOpen} toggle={toggleModalPop}>
                            <ModalHeader toggle={toggleModalPop}>Modal title</ModalHeader>
                            <ModalBody>
                              <div >
                                <div className="">
                                  <div className="flex" style={{ display: 'flex', gap: '5px' }} >

                                    <h3>NAME:</h3>
                                    <span>  {rider.firstName} {rider.surName}</span>
                                  </div>
                                  <div className="flex" style={{ display: 'flex', gap: '5px' }} >

                                    <h3>UNIQUE ID:</h3>
                                    <span>  {rider.firstName} {rider.surName}</span>
                                  </div>
                                </div>










                              </div>
                            </ModalBody>
                            <ModalFooter>
                              <Button color="secondary" onClick={toggleModalPop}>Close</Button>
                            </ModalFooter>
                          </Modal>
                        </th>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <th scope="col">---</th>
                      <th scope="col">---</th>
                      <th scope="col">---</th>
                      <th scope="col">---</th>
                      <th scope="col">---</th>
                      <th scope="col">---</th>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Company Rider Registration Form</ModalHeader>
          <ModalBody>
            <Col lg="" md="8">
              <Card className="bg-secondary shadow border-0">
                <CardBody className="px-lg-5 py-lg-5">
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
                                <i className="ni ni-hat-3" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Last Name"
                              type="text"
                              value={surName}
                              onChange={(e) => setSurName(e.target.value)}
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
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
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
                                <i className="ni ni-circle-08" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Company Rider unique Id"
                              type="text"
                              value={compRideruniqueId}
                              onChange={(e) => setCompRideruniqueId(e.target.value)}
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
                                <i className="ni ni-hat-3" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Residential Address"
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
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
                              placeholder="Rider Balance"
                              type="number"
                              value={RiderBal}
                              onChange={(e) => setRiderBal(e.target.value)}
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
                                <i className="ni ni-building" />
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
                                <i className="ni ni-circle-08" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Account Holder's Name"
                              type="text"
                              value={accountHolderName}
                              onChange={(e) => setAccountHolderName(e.target.value)}
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
                              placeholder="Rider's License Number"
                              type="text"
                              value={licenseNumber}
                              onChange={(e) => setLicenseNumber(e.target.value)}
                            />
                          </InputGroup>
                        </FormGroup>
                      </>
                    )}
                    <div className="text-center">
                      {currentStep > 1 && (
                        <Button className="mt-4 mr-2" color="primary" type="button" onClick={handlePrevious}>
                          Previous
                        </Button>
                      )}
                      {currentStep < 3 && (
                        <Button className="mt-4" color="primary" type="button" onClick={handleNext}>
                          Next
                        </Button>
                      )}
                      {currentStep === 3 && (
                        <Button className="mt-4" color="primary" type="button" onClick={handleSignUp}>
                          {loading ? "Signing Up..." : "Sign Up"}
                        </Button>
                      )}
                    </div>
                    {error && (
                      <Alert color="danger" className="mt-3">
                        {error}
                      </Alert>
                    )}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </ModalBody>
        </Modal>
      </Container>
    </>
  );
};

export default CompDash;
