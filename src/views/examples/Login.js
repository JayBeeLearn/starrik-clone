import React, { useState, useContext } from "react";
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
import { getDoc, getDocs, collection, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import { GlobalContext } from "Globalstate.js";

const Login = () => {
  const [{ userdetails, loggedin, tradingpair, distance }, dispatch] = useContext(GlobalContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility



  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

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
      // userdetails(user);
      console.log("Check User", user)


      if (user.emailVerified) {
        // Proceed to the dashboard

        // Check if the user exists in the 'user' collection
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          console.log("User exists in the 'user' collection");
          // Redirect user to the home page for users
          // history.push('/');
          navigate("/user/maps");
          dispatch({ type: "setuserdetails", snippet: userDoc.data() });
          return;
        }

        console.log(userDoc)


        // Check if the user exists in the 'company' collection
        const companyDoc = await getDoc(doc(db, "independentriders", user.uid));
        if (companyDoc.exists()) {
          console.log("User exists in the 'company' collection");
          // Redirect user to the home page for companies
          // history.push('/company-home');
          navigate("/admin/index");
          dispatch({ type: "setuserdetails", snippet: companyDoc });
          return;
        }




        // Function to get document Id

        // async function getDocumentIds() {
        //   const colRef = collection(db, "company");
        //   const snapshot = await getDoc(colRef);
        //   const docIds = snapshot.docs.map(doc => doc.id);
        //   console.log("Document IDs:", docIds);
        //   return docIds;
        // }
        const compDoc = await getDoc(doc(db, "company", user.uid));


        if (compDoc.exists()) {


          const compData = compDoc.data();
          // Redirect user to the home page for companies
          console.log("Comp details exist on login 6a", compData)
          // navigate("/company/companydash", { state: { user } });
          dispatch({ type: "setuserdetails", snippet: compData });

          navigate("/company/companydash");

          // dispatch({ type: "setuserdetails", snippet: compDoc.data() });
          return;
        }

        const compRider = await getDoc(doc(db, "companyriderslog", user.uid));
        if (compRider.exists()) {

          const compData = compRider.data();
          // Redirect user to the home page for companies
          console.log("Comp details exist on login 6a", compData)
          // navigate("/company/companydash", { state: { user } });
          dispatch({ type: "setuserdetails", snippet: compData });

          navigate("/companyriders/index");
          console.log("Company rider success")
          // dispatch({ type: "setuserdetails", snippet: compDoc.data() });
          return;
        }



        // Check if the user exists in the 'rider' collection
        const riderDoc = await getDoc(doc(db, "companies", user.uid));
        if (riderDoc.exists()) {
          console.log("User exists in the 'rider' collection");
          // Redirect user to the home page for riders
          // history.push('/rider-home');
          navigate("/admin/index");
          dispatch({ type: "setuserdetails", snippet: riderDoc.data() }); // +++ Dispatch rider details to context
          return;
        } else {


          // If user does not exist in any collection, log an error
          setError("User not found")
        }
      } else {
        navigate("/auth/login")

        setError("Email is not verified. Please verify your email first.");
        Swal.fire({
          icon: "warning",
          title: "Email Not Verified",
          text: "Please verify your email before logging in.",
        });
      }



    } catch (error) {
      console.log(error.message)
      setError(error.message);
      if (error.message === "Firebase: Error (auth/invalid-email).") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid Email Address",
        });
        setError("Invalid Email Address");
      }
      if (error.message === "Firebase: Error (auth/network-request-failed).") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Slow or no internet connection",
        });
        setError("Slow or no internet connection");
      }

      if (error.message === "Firebase: Error (auth/invalid-credential).") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid Email Address or Password",
        });
        setError("Invalid Email Address or Password");
      }

      if (error.message === "Firebase: Error (auth/invalid-login-credentials).") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Incorrect login credentials`(email or password is incorrect)",
        });
        setError("Incorrect login credentials`(email or password is incorrect)");
      }

      if (error.message === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.",
        });
        setError("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.");
      }
    } finally {
      console.log('login troubleshoot 2')

      setLoading(false);
    }
  };



  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with credentials</small>
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
                    type={passwordVisible ? "text" : "password"} // Toggle input type
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <i
                        className={passwordVisible ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      />
                    </InputGroupText>
                  </InputGroupAddon>
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
              href="forgetpassword"
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="register"
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


// import React, { useState } from "react";
// import {
//   Button,
//   Card,
//   CardHeader,
//   CardBody,
//   FormGroup,
//   Form,
//   Input,
//   InputGroupAddon,
//   InputGroupText,
//   InputGroup,
//   Row,
//   Col,
// } from "reactstrap";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { auth, db } from "../../firebase";
// import { getDoc, doc } from "firebase/firestore";

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       console.log(email, password);
//       // Sign in user with email and password
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       // Check if the user exists in the 'user' collection
//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       if (userDoc.exists()) {
//         console.log("User exists in the 'user' collection");
//         // Redirect user to the home page for users
//         // history.push('/');
//         navigate("/user/maps");
//         return;
//       }

//       // Check if the user exists in the 'company' collection
//       // check if user is verified
//       const companyDoc = await getDoc(doc(db, "independentriders", user.uid));
//       if (companyDoc.exists()) {
//         console.log("User exists in the 'company' collection");
//         // Redirect user to the home page for companies
//         // history.push('/company-home');
//         navigate("/admin/index");
//         return;
//       }
//       // check if user is verified
//       // Check if the user exists in the 'rider' collection
//       const riderDoc = await getDoc(doc(db, "companies", user.uid));
//       if (riderDoc.exists()) {
//         console.log("User exists in the 'rider' collection");
//         // Redirect user to the home page for riders
//         // history.push('/rider-home');
//         navigate("/admin/index");
//         return;
//       }

//       // If user does not exist in any collection, log an error
//       setError("User not found");
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // const handleLogin = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     setLoading(true); // Set loading state to true when Sign In button is clicked

//   //     // Sign in user with email and password
//   //     const userdoc = await signInWithEmailAndPassword(auth, email, password);
//   //     console.log(userdoc);

//   //     // Redirect to home page after successful login
//   //     // history.push('/');
//   //   } catch (error) {
//   //     setError(error.message);
//   //   } finally {
//   //     setLoading(false); // Reset loading state to false after authentication process is completed
//   //   }
//   // };

//   return (
//     <>
//       <Col lg="5" md="7">
//         <Card className="bg-secondary shadow border-0">
//           <CardBody className="px-lg-5 py-lg-5">
//             <div className="text-center text-muted mb-4">
//               <small>sign in with credentials</small>
//             </div>
//             <Form role="form">
//               <FormGroup className="mb-3">
//                 <InputGroup className="input-group-alternative">
//                   <InputGroupAddon addonType="prepend">
//                     <InputGroupText>
//                       <i className="ni ni-email-83" />
//                     </InputGroupText>
//                   </InputGroupAddon>
//                   <Input
//                     placeholder="Email"
//                     type="email"
//                     autoComplete="new-email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </InputGroup>
//               </FormGroup>
//               <FormGroup>
//                 <InputGroup className="input-group-alternative">
//                   <InputGroupAddon addonType="prepend">
//                     <InputGroupText>
//                       <i className="ni ni-lock-circle-open" />
//                     </InputGroupText>
//                   </InputGroupAddon>
//                   <Input
//                     placeholder="Password"
//                     type="password"
//                     autoComplete="new-password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </InputGroup>
//               </FormGroup>
//               <div className="custom-control custom-control-alternative custom-checkbox">
//                 <input
//                   className="custom-control-input"
//                   id=" customCheckLogin"
//                   type="checkbox"
//                 />
//                 <label
//                   className="custom-control-label"
//                   htmlFor=" customCheckLogin"
//                 >
//                   <span className="text-muted">Remember me</span>
//                 </label>
//               </div>
//               <div className="text-center">
//                 {error && (
//                   <div className="text-center text-danger mb-3">{error}</div>
//                 )}
//                 <Button
//                   onClick={handleLogin}
//                   className="my-4"
//                   color="primary"
//                   type="button"
//                   disabled={loading}
//                 >
//                   {loading ? "Loading..." : "Sign in"}
//                 </Button>
//               </div>
//             </Form>
//           </CardBody>
//         </Card>
//         <Row className="mt-3">
//           <Col xs="6">
//             <a
//               className="text-light"
//               href="forgetpassword"
//               // onClick={(e) => e.preventDefault()}
//             >
//               <small>Forgot password?</small>
//             </a>
//           </Col>
//           <Col className="text-right" xs="6">
//             <a
//               className="text-light"
//               href="register"
//               // onClick={(e) => e.preventDefault()}
//             >
//               <small>Create new account</small>
//             </a>
//           </Col>
//         </Row>
//       </Col>
//     </>
//   );
// };

// export default Login;
