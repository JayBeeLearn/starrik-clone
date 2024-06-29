import React, { useState, useEffect, useContext } from "react";
import { serverTimestamp } from "firebase/firestore";
import MapWrapper from "components/MapWrapper";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Alert } from "reactstrap";
import Header from "components/Headers/Header.js";
import { GlobalContext } from "Globalstate.js";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Swal from "sweetalert2";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PaystackButton } from "react-paystack";
import { usePaystackPayment } from "react-paystack";
import axios from "axios";

//////////////////////////GOOGLE MAPS DEPENDENCIES////////////////////////
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import MapWithDirections from "components/MapwithDirection";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const Maps = () => {
  const navigate = useNavigate();
  // const [pickupAddress, setPickupAddress] = useState(""); // State to hold the pickup address
  // const [deliveryAddress, setDeliveryAddress] = useState(""); // State to hold the delivery address
  // const [pickupCoordinates, setPickupCoordinates] = useState(null); // State to hold the pickup coordinates
  // const [deliveryCoordinates, setDeliveryCoordinates] = useState(null); // State to hold the delivery coordinates
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [originCoordinates, setOriginCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [destinationCoordinates, setDestinationCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [DeliveryState, setDeliveryState] = useState(""); // State to hold the delivery details
  const [PickupState, setPickupState] = useState(""); // State to hold the delivery details
  const handleOriginSelect = async (value) => {
    console.log(value);
    const results = await geocodeByAddress(value);
    console.log(results);
    const [
      {
        formatted_address,
        address_components,
        geometry: { location },
      },
    ] = results;
    console.log(formatted_address); // Full address
    console.log(location.lat()); // Latitude
    console.log(location.lng()); // Longitude

    // Extract state from address components
    const state = address_components.find((component) =>
      component.types.includes("administrative_area_level_1")
    ).long_name;
    console.log("Pickup STATE", state); // State
    setPickupState(state);

    setOriginAddress(formatted_address);
    setOriginCoordinates({ lat: location.lat(), lng: location.lng() });
  };

  const handleDestinationSelect = async (value) => {
    setDestinationAddress(value);
    const results = await geocodeByAddress(value);
    console.log(results);
    const [
      {
        formatted_address,
        address_components,
        geometry: { location },
      },
    ] = results;
    console.log(formatted_address); // Full address
    console.log(location.lat()); // Latitude
    console.log(location.lng()); // Longitude

    // Extract state from address components
    const state = address_components.find((component) =>
      component.types.includes("administrative_area_level_1")
    ).long_name;
    console.log(state); // State
    setDeliveryState(state);

    setDestinationAddress(formatted_address);
    setDestinationCoordinates({ lat: location.lat(), lng: location.lng() });
  };

  // const handleOriginSelect = async (value) => {
  //   console.log(value);
  //   const results = await geocodeByAddress(value);
  //   console.log(results);
  //   const latLng = await getLatLng(results[0]);
  //   setOriginAddress(value);
  //   setOriginCoordinates(latLng);
  //   console.log(latLng);
  // };

  // const handleDestinationSelect = async (value) => {
  //   setOriginAddress(value);
  //   const results = await geocodeByAddress(value);
  //   console.log(results);
  //   const latLng = await getLatLng(results[0]);
  //   setDestinationAddress(value);
  //   setDestinationCoordinates(latLng);
  // };

  const [deliveryDetails, setDeliveryDetails] = useState(""); // State to hold the delivery details
  const [receiverDetails, setReceiverDetails] = useState("");
  const [{ userdetails, loggedin, tradingpair, distance }, dispatch] =
    useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [amonutForPaystack, setamonutForPaystack] = useState(1000);

  /////////////////////For Alert//////////////////
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("danger");

  const toggleAlert = () => setAlertVisible(!alertVisible);

  /////////////////////For MODAL//////////////////
  // const [distance, setdistance] = useState(0);
  const [priceToPay, setpriceToPay] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
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
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setdetails(userDoc.data());
            console.log(userDoc.data());
            setLoading(false);
          } else {
            console.log("User data not found in Firestore.");
            setLoading(false);
            navigate("/auth/login");
          }
          // setModalOpen(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      } else {
        // If user is not logged in, redirect to login page
        // history.push("/login");
        navigate("/auth/login");
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

  ////////////////////////////////LISTEN TO USER ORDER DETAILS///////////////////////////////
  ////////////////////////////////LISTEN TO USER ORDER DETAILS///////////////////////////////
  ////////////////////////////////LISTEN TO USER ORDER DETAILS///////////////////////////////
  ////////////////////////////////LISTEN TO USER ORDER DETAILS///////////////////////////////
  ////////////////////////////////LISTEN TO USER ORDER DETAILS///////////////////////////////

  useEffect(() => {
    // console.log("fetching UserId: ", auth.currentUser.uid)
    const unsubscribeOrder = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const orderCollectionRef = collection(db, "order");
          const userOrdersQuery = query(
            orderCollectionRef,
            where("userid", "==", auth.currentUser.uid),
            where("status", "==", "confirmed")
          );
          const unsubscribeOrder = onSnapshot(userOrdersQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              const orderData = change.doc.data();
              const orderId = change.doc.id;
              // Do something with the orderData, e.g., update state
              if (orderData.status === "confirmed") {
                // setamonutForPaystack(orderData.distance * 180);
                console.log("orderData.distance", orderData.distance * 180);
                // If order status is confirmed, show the payment modal
                // togglePaymentModal(true);
                // setOrderDetails({ ...orderData, id: orderId });
                console.log(orderData);
              }
              console.log("Order status changed:", orderData.status);
            });
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      } else {
        // If user is not logged in, redirect to login page
        // history.push("/login");
      }
    });

    return () => unsubscribeOrder();
  }, []);
  ////////////////////////////////LISTEN TO USER ORDER DETAILS///////////////////////////////
  ////////////////////////////////LISTEN TO USER ORDER DETAILS///////////////////////////////
  ////////////////////////////////LISTEN TO USER ORDER DETAILS///////////////////////////////
  ////////////////////////////////LISTEN TO USER ORDER DETAILS///////////////////////////////
  ////////////////////////////////LISTEN TO USER ORDER DETAILS///////////////////////////////

  // const handlePickupAddressChange = (e) => {
  //   setPickupAddress(e.target.value);
  // };

  // const handleDeliveryAddressChange = (e) => {
  //   setDeliveryAddress(e.target.value);
  // };

  const handleDeliveryDetailsChange = (e) => {
    setDeliveryDetails(e.target.value);
  };

  const handleReceiverDetailsChange = (e) => {
    setReceiverDetails(e.target.value);
  };

  const confirmOrder = () => {
    // Scroll the user to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
  };

  //   fetchCoordinates("pickup", pickupAddress, setPickupCoordinates);
  //   fetchCoordinates("delivery", deliveryAddress, setDeliveryCoordinates);
  // };

  // const confirmOrder = () => {
  //   // Check if pickup and delivery addresses are not empty
  //   if (!pickupAddress || !deliveryAddress) {
  //     setAlertMessage("Fill In Required Fields");
  //     setAlertType("danger");
  //     toggleAlert();
  //     return;
  //   }

  //   fetchCoordinates("pickup", pickupAddress, setPickupCoordinates);
  //   fetchCoordinates("delivery", deliveryAddress, setDeliveryCoordinates);
  // };

  // const fetchCoordinates = (type, address, setter) => {
  //   fetch(
  //     `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
  //       address
  //     )}&apiKey=ae8e508bc0654ed688b43818597f7640`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);

  //       if (data.features.length > 0) {
  //         const properties = data.features[0].properties;

  //         // Extract city, county, and address_line1
  //         const state = properties.state || "";
  //         const city = properties.city || "";
  //         const county = properties.county || "";
  //         const address_line1 = properties.street || "";

  //         // const [DeliveryState, setDeliveryState] = useState(""); // State to hold the delivery details
  //         // const [PickupState, setPickupState] = useState(""); // State to hold the delivery details
  //         // type="delivery"
  //         // type="pickup"

  //         if (type == "delivery") {
  //           setDeliveryState(state);
  //         } else if (type == "pickup") {
  //           setPickupState(state);
  //         }
  //         console.log("State:", state);
  //         console.log("City:", city);
  //         console.log("County:", county);
  //         console.log("Address Line 1:", address_line1);

  //         setter([properties.lat, properties.lon]);
  //       } else {
  //         console.error("No features found in the response.");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching coordinates:", error);
  //     });
  // };

  // function calculateDistance(lat1, lon1, lat2, lon2) {
  //   const R = 6371e3; // Earth radius in meters
  //   const φ1 = (lat1 * Math.PI) / 180; // Latitude of pickup in radians
  //   const φ2 = (lat2 * Math.PI) / 180; // Latitude of delivery in radians
  //   const Δφ = ((lat2 - lat1) * Math.PI) / 180; // Change in latitude in radians
  //   const Δλ = ((lon2 - lon1) * Math.PI) / 180; // Change in longitude in radians

  //   // Haversine formula
  //   const a =
  //     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
  //     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //   // Distance in meters
  //   const distance = R * c;

  //   // Distance in kilometers (optional)
  //   const distanceInKm = distance / 1000;

  //   return distanceInKm; // Return distance in kilometers
  // }

  //////////////////////////modal for order details////////////////////////

  const ConfirmdetailsOfOrder = () => {
    if (
      !originAddress ||
      !destinationAddress ||
      !deliveryDetails ||
      !receiverDetails
    ) {
      toggleAlert();
      return;
    }
    // const distance = calculateDistance(
    //   pickupCoordinates[0], // Latitude of pickup
    //   pickupCoordinates[1], // Longitude of pickup
    //   deliveryCoordinates[0], // Latitude of delivery
    //   deliveryCoordinates[1] // Longitude of delivery
    // );
    // setdistance(distance);
    console.log("Distance between pickup and delivery:", distance, "km");
    // Open modal to confirm order
    toggleModal();
  };

  //////////////////////////modal for order details////////////////////////

  const checkUserOrders = async () => {
    try {
      const orderCollectionRef = collection(db, "order");
      const userOrdersQuery = query(
        orderCollectionRef,
        where("userid", "==", auth.currentUser.uid),
        where("status", "in", ["pending", "confirmed"])
      );
      const userOrdersSnapshot = await getDocs(userOrdersQuery);
      const userOrders = userOrdersSnapshot.docs.map((doc) => doc.data());
      return userOrders;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return [];
    }
  };
  /////////////////////////////////////////////////////PAYSTACK PAYMENT/////////////////////////////////
  /////////////////////////////////////////////////////PAYSTACK PAYMENT/////////////////////////////////
  /////////////////////////////////////////////////////PAYSTACK PAYMENT/////////////////////////////////
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const togglePaymentModal = (isOpen) => {
    setPaymentModalOpen(isOpen);
  };

  console.log(amonutForPaystack);
  const config = {
    reference: new Date().getTime().toString(),
    email: userdetails.email,
    amount: Math.ceil(amonutForPaystack * 100), //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: "pk_test_d279c09e6f248385b6153afb84528afc722c0225",
  };

  const updateOrder = async (orderId, updateData) => {
    try {
      const orderRef = doc(db, "order", orderId);
      await updateDoc(orderRef, updateData);
      console.log("Order updated successfully!");
      setAlertMessage("Order updated successfully!");
      setAlertType("success");
      toggleAlert();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  async function sendEmail(user, pass, htmlToSend, email, subject) {
    // https://renderallmybackend.onrender.com/
    const url = "https://starrik-mini-backend.onrender.com/send-mail"; // Replace with your actual server URL
    try {
      const response = await axios.post(url, {
        htmlToSend: htmlToSend,
        user: user,
        pass: pass,
        email: email, //email
        subject: subject,
        CompanyName: "Starrik",
      });
      console.log(response.data.message); // Log the success message
      // Swal.fire("Processing!", "The Withdrawal is Being Processed.", "success");
    } catch (error) {
      console.error(error);
    }
  }

  const SendMailtoClientRenderSMTP = async () => {
    console.log("order paid for:", orderDetails);
    const htmlTemplate = `
   <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f1f1f1;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border: 1px solid #e1e1e1;
            border-radius: 8px;
        }

        .logo {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo img {
            max-width: 150px;
        }

        .hero {
            text-align: left;
            padding: 20px;
            background-color: #E45EC5;
            color: white;
            border-radius: 8px;
        }

        .hero h2 {
            margin: 0;
        }

        .order-details {
            margin-top: 20px;
        }

        .order-details h4 {
            margin-bottom: 10px;
            color: #E45EC5;
        }

        .order-details p {
            margin: 5px 0;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            color: #888888;
        }
    </style>
</head>

<body>
    <center style="width: 100%; background-color: #f1f1f1;">
        <div class="email-container">
            <table role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                <tbody>
                    <tr>
                        <td class="logo" valign="top">
                            <img src="https://starrik-945ee.web.app/img/argon-react.png" alt="Company Logo">
                        </td>
                    </tr>
                    <tr>
                        <td class="hero bg_white" style="padding: 2em 0 2em 0;" valign="middle">
                            <table role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0">
                                <tbody>
                                    <tr>
                                        <td style="padding: 0 2.5em; text-align: left;">
                                            <div class="text">
                                                <h2>Starrik Successful Order Placement</h2>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="order-details">
                <h4>Order Details:</h4>
                <p><strong>Amount:</strong> ₦${orderDetails.deliveryprice}</p>
                  <p><strong>Pick up Address:</strong> ${orderDetails.pickupAddress}</p>
                    <p><strong>Delivery Address:</strong> ${orderDetails.deliveryAddress}</p>
                <!-- Add more order details here as needed -->
            </div>
            <div class="footer">
                <p>For inquiries/complaints, contact the Admin via any of the communication channels.</p>
            </div>
        </div>
    </center>
</body>

</html>

      `;
    const user = "info@starrik.com";
    const pass = "nothing";
    const emails = userdetails.email;
    console.log(emails);
    const subject = "Successful Order";
    sendEmail(user, pass, htmlTemplate, emails, subject);
    //// window.location.replace("/dashboard");
  };

  const handlePaystackSuccessAction = async (reference) => {
    console.log(reference);
    console.log("order paid for:", orderDetails);

    try {
      // Add order details to Firestore
      await addDoc(collection(db, "order"), {
        ...orderDetails,
        refrence: reference,
      });

      setAlertMessage("order placed successfully!");
      togglePaymentModal(false);
      setAlertType("success");
      toggleAlert();
      console.log("Order placed successfully!");
      ////////////////////////////////////////
      ///////////////////////////////////////
      //////////////////////////////////////
      /////////////////////////////////////
      ///////////////SEND EMAIL HERE///////
      await SendMailtoClientRenderSMTP();
      // https://starrik-mini-backend.onrender.com
      ////////////////////////////////////////
      ///////////////////////////////////////
      //////////////////////////////////////
      /////////////////////////////////////
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // you can call this function anything
  const handlePaystackCloseAction = () => {
    console.log("closed");
    console.log("order paid for:", orderDetails);
  };

  const componentProps = {
    ...config,
    text: "Pay For this order",
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };
  /////////////////////////////////////////////////////PAYSTACK PAYMENT/////////////////////////////////
  /////////////////////////////////////////////////////PAYSTACK PAYMENT/////////////////////////////////

  const cancelorders = async () => {
    togglePaymentModal(false);
    const orderId = orderDetails.id;
    const updateData = {
      status: "canclled",
    };
    updateOrder(orderId, updateData);
  };

  const statesAndCharges = [
    { state: "Abia", city: "Umuahia", charge: 350 },
    { state: "Adamawa", city: "Yola", charge: 320 },
    { state: "Akwa Ibom", city: "Uyo", charge: 340 },
    { state: "Anambra", city: "Awka", charge: 380 },
    { state: "Bauchi", city: "Bauchi", charge: 330 },
    { state: "Bayelsa", city: "Yenagoa", charge: 370 },
    { state: "Benue", city: "Makurdi", charge: 340 },
    { state: "Borno", city: "Maiduguri", charge: 310 },
    { state: "Cross River", city: "Calabar", charge: 350 },
    { state: "Delta", city: "Asaba", charge: 350 },
    { state: "Ebonyi", city: "Abakaliki", charge: 340 },
    { state: "Edo", city: "Benin", charge: 400 },
    { state: "Ekiti", city: "Ado-Ekiti", charge: 320 },
    { state: "Enugu", city: "Enugu", charge: 370 },
    { state: "Gombe", city: "Gombe", charge: 330 },
    { state: "Imo", city: "Owerri", charge: 360 },
    { state: "Jigawa", city: "Dutse", charge: 290 },
    { state: "Kaduna", city: "Kaduna", charge: 310 },
    { state: "Kano", city: "Kano", charge: 310 },
    { state: "Katsina", city: "Katsina", charge: 320 },
    { state: "Kebbi", city: "Birnin Kebbi", charge: 290 },
    { state: "Kogi", city: "Lokoja", charge: 360 },
    { state: "Kwara", city: "Ilorin", charge: 320 },
    { state: "Lagos", city: "Ikeja", charge: 430 },
    { state: "Nasarawa", city: "Lafia", charge: 340 },
    { state: "Niger", city: "Minna", charge: 340 },
    { state: "Ogun", city: "Abeokuta", charge: 315 },
    { state: "Ondo", city: "Akure", charge: 340 },
    { state: "Osun", city: "Oshogbo", charge: 330 },
    { state: "Oyo", city: "Ibadan", charge: 410 },
    { state: "Plateau", city: "Jos", charge: 320 },
    { state: "Rivers", city: "Port Harcourt", charge: 400 },
    { state: "Sokoto", city: "Sokoto", charge: 340 },
    { state: "Taraba", city: "Jalingo", charge: 290 },
    { state: "Yobe", city: "Damaturu", charge: 320 },
    { state: "Zamfara", city: "Gusau", charge: 310 },
    { state: "FCT", city: "Abuja", charge: 460 },
  ];
  const placeOrder = async () => {
    const userOrders = await checkUserOrders();

    // Check if user has any orders with status "pending" or "confirmed"
    if (userOrders.length > 0) {
      console.log("User has pending -Please confirm or cancel order:");
      // return;
      // Here you can handle the logic accordingly, e.g., show a message or prevent placing a new order
    } else {
      console.log("User does not have pending or confirmed orders");
      // User can proceed to place a new order
    }

    // Check if required fields are empty
    if (
      !originAddress ||
      !destinationAddress ||
      !deliveryDetails ||
      !receiverDetails
    ) {
      setAlertMessage("Fill In Required Fields");
      setAlertType("danger");
      toggleAlert();
      return;
    }
    // const distance = calculateDistance(
    //   pickupCoordinates[0], // Latitude of pickup
    //   pickupCoordinates[1], // Longitude of pickup
    //   deliveryCoordinates[0], // Latitude of delivery
    //   deliveryCoordinates[1] // Longitude of delivery
    // );
    console.log("Distance between pickup and delivery:", distance, "km");

    // Confirm order again to make sure coordinates are updated
    // confirmOrder();

    const statevvale_ = PickupState; // Get only the city name
    const foundState = statesAndCharges.find(
      (state) => state.state.toLowerCase() === statevvale_.toLowerCase()
    );

    toggleModal();
    togglePaymentModal(true);
    setamonutForPaystack(distance * foundState.charge);
    setOrderDetails({
      deliveryprice: distance * foundState.charge,
      DeliveryState: DeliveryState,
      PickupState: PickupState,
      userid: auth.currentUser.uid,
      pickupAddress: originAddress,
      deliveryAddress: destinationAddress,
      distance: distance,
      pickupCoordinates: originCoordinates,
      deliveryCoordinates: destinationCoordinates,
      deliveryDetails: deliveryDetails,
      receiverDetails: receiverDetails,
      dateCreated: serverTimestamp(),
      status: "pending", // Set initial status
      userPhone: userdetails.phoneNumber,
      riderLocation: null,
    });
  };

  ////////////////////WATCH USER LOCATION///////////////////
  // useEffect(() => {
  //   const locationListener = navigator.geolocation.watchPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       console.log("Current location:", longitude, "Current location:", latitude);
  //       // Update Firestore field with the new location data
  //     },
  //     (error) => {
  //       console.error("Error getting user's location:", error);
  //     }
  //   );
  //   return () => {
  //     // Clean up the location listener when the component unmounts
  //     navigator.geolocation.clearWatch(locationListener);
  //   };
  // }, []);

  return (
    <div>
      <Header />
      <Container className="mt--7" fluid>
        <div
          className="shadow border-0"
          style={{ height: "50vh", width: "100%" }}
        >
          <MapWithDirections
            originCoordinates={originCoordinates}
            destinationCoordinates={destinationCoordinates}
          />
          {/* <MapWrapper
            pickupAddress={pickupCoordinates}
            deliveryAddress={deliveryCoordinates}
          /> */}
        </div>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="bg-secondary shadow border-0">
              <CardBody>
                <Form>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Place an order
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="6">
                        {/* <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Pick up Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-address"
                            placeholder="Enter Pick up Address"
                            type="text"
                            value={pickupAddress}
                            onChange={handlePickupAddressChange}
                          />
                        </FormGroup> */}
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Pick up Address
                          </label>
                          <PlacesAutocomplete
                            value={originAddress}
                            onChange={setOriginAddress}
                            onSelect={handleOriginSelect}
                          >
                            {({
                              getInputProps,
                              suggestions,
                              getSuggestionItemProps,
                              loading,
                            }) => (
                              <div>
                                <Input
                                  {...getInputProps({
                                    id: "input-address",
                                    placeholder: "Enter Pick up Address",
                                    type: "text",
                                    className: "form-control-alternative",
                                  })}
                                />
                                <div className="autocomplete-dropdown-container">
                                  {loading && <div>Loading...</div>}
                                  {suggestions.map((suggestion) => {
                                    const className = suggestion.active
                                      ? "suggestion-item--active"
                                      : "suggestion-item";
                                    const style = suggestion.active
                                      ? {
                                          backgroundColor: "#fafafa",
                                          cursor: "pointer",
                                        }
                                      : {
                                          backgroundColor: "#ffffff",
                                          cursor: "pointer",
                                        };
                                    return (
                                      <div
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                        })}
                                      >
                                        <span>{suggestion.description}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete>
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        {/* <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Delivery Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-address"
                            placeholder="Enter Delivery Address" 
                            type="text"
                            value={deliveryAddress}
                            onChange={handleDeliveryAddressChange}
                          />
                        </FormGroup> */}
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Delivery Address
                          </label>
                          <PlacesAutocomplete
                            value={destinationAddress}
                            onChange={setDestinationAddress}
                            onSelect={handleDestinationSelect}
                          >
                            {({
                              getInputProps,
                              suggestions,
                              getSuggestionItemProps,
                              loading,
                            }) => (
                              <div>
                                <Input
                                  {...getInputProps({
                                    id: "input-address",
                                    placeholder: "Enter Destination Address",
                                    type: "text",
                                    className: "form-control-alternative",
                                  })}
                                />
                                <div className="autocomplete-dropdown-container">
                                  {loading && <div>Loading...</div>}
                                  {suggestions.map((suggestion) => {
                                    const className = suggestion.active
                                      ? "suggestion-item--active"
                                      : "suggestion-item";
                                    const style = suggestion.active
                                      ? {
                                          backgroundColor: "#fafafa",
                                          cursor: "pointer",
                                        }
                                      : {
                                          backgroundColor: "#ffffff",
                                          cursor: "pointer",
                                        };
                                    return (
                                      <div
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                        })}
                                      >
                                        <span>{suggestion.description}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete>
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="text-center">
                      <Button
                        className="my-4"
                        color="primary"
                        type="button"
                        onClick={confirmOrder}
                      >
                        Confirm location
                      </Button>
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  {/* <h6 className="heading-small text-muted mb-4">
                    Delivery details
                  </h6> */}
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>Delivery details</label>
                      <Input
                        className="form-control-alternative"
                        placeholder="A few words about you ..."
                        rows="4"
                        defaultValue="Describe the deiivery details and additional information"
                        type="textarea"
                        value={deliveryDetails}
                        onChange={handleDeliveryDetailsChange}
                      />
                    </FormGroup>
                  </div>

                  {/* <h6 className="heading-small text-muted mb-4">
                    Reciver details
                  </h6> */}
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>Reciver details</label>
                      <Input
                        className="form-control-alternative"
                        placeholder="A few words about you ..."
                        rows="4"
                        defaultValue="Describe the deiivery details and additional information"
                        type="textarea"
                        value={receiverDetails}
                        onChange={handleReceiverDetailsChange}
                      />
                    </FormGroup>
                  </div>
                  <div className="text-center">
                    <Button
                      className="my-4"
                      color="primary"
                      type="button"
                      onClick={ConfirmdetailsOfOrder}
                    >
                      Place Order
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <div>
        {/* Your existing JSX code */}
        <Alert
          color={alertType}
          isOpen={alertVisible}
          toggle={toggleAlert}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999, // Ensure it appears on top of other elements
          }}
        >
          {alertMessage}
        </Alert>
      </div>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Order Details</ModalHeader>
        <ModalBody>
          <p>Pickup Address: {originAddress}</p>
          <p>Delivery Address: {destinationAddress}</p>
          <p>Delivery Details: {deliveryDetails}</p>
          <p>Receiver Details: {receiverDetails}</p>
          <p>Distance: {distance} km</p>
          {PickupState !== "" && (
            <p>
              Price: ₦{" "}
              {(
                distance *
                statesAndCharges.find(
                  (state) =>
                    state.state.toLowerCase() === PickupState.toLowerCase()
                ).charge
              ).toLocaleString()}
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={placeOrder}>
            Confirm Order
          </Button>{" "}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Your existing JSX code */}
      {/* Your existing modals */}
      {/* Payment modal */}
      <Modal isOpen={paymentModalOpen} toggle={() => togglePaymentModal(false)}>
        <ModalHeader toggle={() => togglePaymentModal(false)}>
          Payment
        </ModalHeader>
        <ModalBody>
          <p>Order ID: {orderDetails && orderDetails.id}</p>
          <p>Pickup Address: {orderDetails && orderDetails.pickupAddress}</p>
          <p>
            Delivery Address: {orderDetails && orderDetails.deliveryAddress}
          </p>

          {orderDetails && orderDetails.distance && (
            <p>
              Price: ₦{" "}
              {(
                orderDetails &&
                orderDetails.distance *
                  statesAndCharges.find(
                    (state) =>
                      state.state.toLowerCase() === PickupState.toLowerCase()
                  ).charge
              ).toLocaleString()}
            </p>
          )}
          {/* Add more order details as needed */}
        </ModalBody>
        <ModalFooter>
          <PaystackButton {...componentProps} />
          <Button color="secondary" onClick={cancelorders}>
            Cancel Order
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Maps;
