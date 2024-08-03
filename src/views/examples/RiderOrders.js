import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "Globalstate.js";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import MapWithDirections from "components/MapwithDirection";
import OrderDetailsModal from "components/OrderDetails";
import MapWrapper from "components/MapWrapper"; // Import your MapWrapper component
import {
  collection,
  query,
  getDocs,
  onSnapshot,
  where,
  orderBy, doc, updateDoc, getDoc
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import OrderConfirmationModal from "components/OrderConfirmationModal";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";

const Tables = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [deliveryCoordinates, setDeliveryCoordinates] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);


  //////////////////////////////////////////////////////
  //////////////////////AUTHENTICATION//////////////////////////////
  //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  const navigate = useNavigate();
  const [{ userdetails, loggedin, tradingpair }, dispatch] =
    useContext(GlobalContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("fetching UserId: ", auth.currentUser.uid)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (user) {
        try {
          setLoading(true);
          // Get user details from Firestore
          const userDoc = await getDoc(doc(db, "independentriders", user.uid));
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
  //////////////////////AUTHENTICATION//////////////////
  //////////////////////////////////////////////////////


  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     query(
  //       collection(db, "order"),
  //       // where("PickupState", "==", "Enugu State"),
  //       // where("PickupState", "in", ["Enugu State", "Enugu"]),
  //       where("status", "==", "pending"),
  //       orderBy("dateCreated", "desc")
  //     ),
  //     (snapshot) => {
  //       const fetchedOrders = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setOrders(fetchedOrders);
  //     },
  //     (error) => {
  //       console.error("Error fetching orders:", error);
  //     }
  //   );

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  // useEffect(() => {
  //   // Get user's current location
  //   navigator.geolocation.getCurrentPosition(async (position) => {
  //     const { latitude, longitude } = position.coords;
  // console.log("Latitude:", latitude);
  // console.log("Longitude:", longitude);
  //     // Get city and state information using Geoapify
  //     try {
  //       const response = await axios.get(
  //         `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=ae8e508bc0654ed688b43818597f7640`
  //       );
  //       const city = response.data.features[0]?.properties?.city;
  //       const state = response.data.features[0]?.properties?.state;
  //       const state1 = response.data.features[0]?.properties?.state.split(" ")[0]; // Get only the city name
  //       console.log("City:", city);
  //       console.log("State:", state);
  //       console.log("State1:", state1);

  //       // Fetch orders based on city and state
  //       const unsubscribe = onSnapshot(
  //         query(
  //           collection(db, "order"),
  //           where("PickupState", "in", [state1, state]), // Filter based on Geoapify data
  //           // where("PickupState", "in", ["Enugu", state]), // Filter based on Geoapify data
  //           where("status", "==", "pending"),
  //           orderBy("dateCreated", "desc")
  //         ),
  //         (snapshot) => {
  //           const fetchedOrders = snapshot.docs.map((doc) => ({
  //             id: doc.id,
  //             ...doc.data(),
  //           }));
  //           setOrders(fetchedOrders);
  //         },
  //         (error) => {
  //           console.error("Error fetching orders:", error);
  //         }
  //       );

  //       return () => {
  //         unsubscribe();
  //       };
  //     } catch (error) {
  //       console.error("Error fetching location data:", error);
  //     }
  //   });
  // }, []);



  // WITH Google
  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      // Reverse geocode using Google Maps Geocoding API
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDe7MVXvMqxrmO2Lf3nvvPPrXTUpcqVkXg&libraries=places`
        );
        const results = response.data.results;
        if (results.length > 0) {
          const addressComponents = results[0].address_components;
          let city, state;
          for (let component of addressComponents) {
            if (component.types.includes("locality")) {
              city = component.long_name;
            }
            if (component.types.includes("administrative_area_level_1")) {
              state = component.long_name;
            }
          }
          console.log("City:", city);
          console.log("State:", state);

          // Fetch orders based on city and state
          const unsubscribe = onSnapshot(
            query(
              collection(db, "order"),
              // where("PickupState", "==", state),
              where("PickupState", "in", [state, `${state} State`]), // Filter based on Geoapify data
              //  where("PickupState", "in", ["Akwa Ibom", state]),
              where("status", "==", "pending"),
              orderBy("dateCreated", "desc")
            ),
            (snapshot) => {
              const fetchedOrders = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setOrders(fetchedOrders);
            },
            (error) => {
              console.error("Error fetching orders:", error);
            }
          );

          return () => {
            unsubscribe();
          };
        } else {
          console.error("No results found for reverse geocoding.");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    });
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setPickupCoordinates(order.pickupCoordinates);
    setDeliveryCoordinates(order.deliveryCoordinates);
    toggleModal();
  };

  const handleorderTrackingpickup = (order) => {
    setSelectedOrder(order);
    watchCurrentLocationAndSetCoordinates(order.pickupCoordinates, setPickupCoordinates);
    setDeliveryCoordinates(order.pickupCoordinates);
    toggleModal();
  };

  const handleorderTrackingdestination = (order) => {
    setSelectedOrder(order);
    watchCurrentLocationAndSetCoordinates(order.pickupCoordinates, setPickupCoordinates);
    setDeliveryCoordinates(order.deliveryCoordinates);
    toggleModal();
  };

  const watchCurrentLocationAndSetCoordinates = (initialCoordinates, setCoordinates) => {
    const locationListener = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Current location:", latitude, longitude);
        // Update the pickupCoordinates with the current location
        setPickupCoordinates({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );

    return () => {
      // Clean up the location listener when component unmounts or when coordinates are set
      navigator.geolocation.clearWatch(locationListener);
    };
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleconfirmationModal = () => {
    setConfirmationModalOpen(!confirmationModalOpen);
  };

  const handleConfirmationOrder = (order) => {
    setSelectedOrder(order);
    setPickupCoordinates(order.pickupCoordinates);
    setDeliveryCoordinates(order.deliveryCoordinates);
    toggleconfirmationModal();
  };
  const toggleConfirmationModal = () => {
    setConfirmationModalOpen(!confirmationModalOpen);
  };

  const confirmOrder = async (order) => {
    console.log(order);
    console.log(order.id);
    const auth = getAuth();
    const currentUser = auth.currentUser;


    // just added this to close modal upon clicking "Confirm" on OrderConfirmationModal component
    toggleConfirmationModal()

    try {
      const ordersRef = collection(db, "order");
      const riderOrdersQuery = query(
        ordersRef,
        where("riderid", "==", currentUser.uid),
        // where("status", "==", "confirmed"),
        where("status", "in", ["confirmed", "delivered"]),
      );
      const riderOrdersSnapshot = await getDocs(riderOrdersQuery);

      if (!riderOrdersSnapshot.empty) {
        // There exists at least one order for the current user with status "confirmed"
        alert("Please deliver picked orders to proceed with other orders");
        return
      } else {
        // There are no orders for the current user with status "confirmed"

        const orderRef = doc(db, "order", order.id);
        await updateDoc(orderRef, {
          status: "confirmed",
          dateConfirmed: new Date(),
          riderid: currentUser.uid,
          riderphone: userdetails.phoneNumber,
          riderUniqueId: userdetails.uniqueId,
        });
        console.log("Order updated successfully!");
        Swal.fire({
          icon: "success",
          title: "Order confirmed!",
          text: "Order updated successfully!",
        });
        navigate("/admin/runningorder");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
    }
    toggleConfirmationModal();
  };


  ////////////////////WATCH RIDER LOCATION///////////////////
  
  useEffect(() => {
    const locationListener = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Current location:", latitude, longitude);

        // Update Firestore field with the new location data
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userOrder = onSnapshot(
              query(
                collection(db, "order"),
                where("riderid", "==", user.uid),
                where("status", "in", ["confirmed", "delivered"])
              ),
              (snapshot) => {
                snapshot.docs.forEach(async (singleorder) => {
                  const orderId = singleorder.id;
                  // Update the riderLocation field of each order document

                  const orderRef = doc(db, "order", orderId);
                  await updateDoc(orderRef, {
                    riderLocation: { latitude, longitude }
                  });
                });
              },
              (error) => {
                console.error("Error fetching orders:", error);
              }
            );
          } else {
            // Handle if user is not authenticated
          }
        });
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );

    return () => {
      // Clean up the location listener when the component unmounts
      navigator.geolocation.clearWatch(locationListener);
    };
  }, []);

  return (
    <>
      <Header />

      {pickupCoordinates && deliveryCoordinates && (
        <div
          className="modal-map-wrapper"
          style={{ height: "50vh", width: "100%" }}
        >
          {/* <MapWrapper
            pickupAddress={pickupCoordinates}
            deliveryAddress={deliveryCoordinates}
          /> */}
          <MapWithDirections
            originCoordinates={pickupCoordinates}
            destinationCoordinates={deliveryCoordinates}
          />
        </div>
      )}
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                <h3 className="text-white mb-0">Active orders</h3>
              </CardHeader>
              <Table
                className="align-items-center table-dark table-flush"
                responsive
              >
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Delivery Fee</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>₦{order.deliveryprice.toFixed(1)}</td>
                      <td>{order.distance.toFixed(1)} km</td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>

                            <DropdownItem
                              onClick={() => handleViewOrder(order)}
                            >
                              View Order Details
                            </DropdownItem>

                            <DropdownItem
                              onClick={() => handleConfirmationOrder(order)}
                            >
                              Accept
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleorderTrackingpickup(order)}
                            >
                              Track pickup
                            </DropdownItem>

                            <DropdownItem
                              onClick={() => handleorderTrackingdestination(order)}
                            >
                              Track Destination
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleConfirmationOrder(order)}
                            >
                              Accept
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
      {modalOpen && (
        <OrderDetailsModal order={selectedOrder} toggleModal={toggleModal} />
      )}
      {confirmationModalOpen && (
        <OrderConfirmationModal
          isOpen={confirmationModalOpen}
          toggle={toggleConfirmationModal}
          order={selectedOrder}
          confirmOrder={confirmOrder}
        />
      )}
    </>
  );
};

export default Tables;
