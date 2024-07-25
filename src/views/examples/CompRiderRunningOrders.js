import React, { useState, useEffect } from "react";
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
import Swal from "sweetalert2";
import Header from "components/Headers/Header.js";
import OrderDetailsModal from "components/OrderDetails";
import MapWithDirections from "components/MapwithDirection";
import MapWrapper from "components/MapWrapper"; // Import your MapWrapper component
import {
  collection,
  query,
  getDocs,
  onSnapshot,
  where,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import OrderConfirmationModal from "components/OrderConfirmationModal";
import RiderMapTracking from "components/RiderMapTracking";

const RiderRunningOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [deliveryCoordinates, setDeliveryCoordinates] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  useEffect(() => {
    // console.log("fetching UserId: ", auth.currentUser.uid)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userorder = onSnapshot(
          query(
            collection(db, "order"),
            where("riderid", "==", user.uid),
            where("status", "==", "confirmed")
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
      } else {
        // If user is not logged in, redirect to login page
        // history.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setPickupCoordinates();
    setDeliveryCoordinates(order.pickupCoordinates);
    toggleModal();
  };

  // const handleorderTrackingpickup = (order) => {
  //   setSelectedOrder(order);
  //   setPickupCoordinates();
  //   setDeliveryCoordinates(order.pickupCoordinates);
  //   toggleModal();
  // };

  // const handleorderTrackingdestination = (order) => {
  //   setSelectedOrder(order);
  //   setPickupCoordinates(order.pickupCoordinates);
  //   setDeliveryCoordinates(order.deliveryCoordinates);
  //   toggleModal();
  // };

  const handleorderTrackingpickup = (order) => {
    setSelectedOrder(order);
    watchCurrentLocationAndSetCoordinates(order.pickupCoordinates, setPickupCoordinates);
    setDeliveryCoordinates(order.pickupCoordinates);
    toggleModal();
  };
  
  const handleorderTrackingdestination= (order) => {
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
        setPickupCoordinates({lat: latitude,lng: longitude });
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
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Confirm order delivery?",
      text: "Are you sure you want to confirm the delivery of this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    // If the user confirms the action, update the order status
    if (result.isConfirmed) {
      ////////////////////////Update current Delivery Location Location Get Rider Current Location///////////////////////////////////
      ////////////////////////Update current Delivery Location Location Get Rider Current Location///////////////////////////////////
      ////////////////////////Update current Delivery Location Location Get Rider Current Location///////////////////////////////////
      ////////////////////////Update current Delivery Location Location Get Rider Current Location///////////////////////////////////
      ////////////////////////Update current Delivery Location Location Get Rider Current Location///////////////////////////////////
      ////////////////////////Update current Delivery Location Location Get Rider Current Location///////////////////////////////////
      ////////////////////////Update current Delivery Location Location Get Rider Current Location///////////////////////////////////
      ////////////////////////Update current Delivery Location Location Get Rider Current Location///////////////////////////////////
      const orderRef = doc(db, "order", order.id);
      try {
        await updateDoc(orderRef, {
          status: "delivered",
          dateConfirmed: new Date(),
        });
        console.log("Order updated successfully!");
        Swal.fire({
          icon: "success",
          title: "Order confirmed!",
          text: "Order updated successfully!",
        });
      } catch (error) {
        console.error("Error updating order:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error occurred while updating the order!",
        });
      }
    }
  };


  ////////////////////WATCH RIDER LOCATION///////////////////
  useEffect(() => {
    const locationListener = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Current location:", latitude, longitude);
  
        // Update Firestore field with the new location data
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          console.log("user id:", user.uid)
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
          <RiderMapTracking
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
                <h3 className="text-white mb-0">My Running Orders</h3>
              </CardHeader>
              <Table
                className="align-items-center table-dark table-flush"
                responsive
              >
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Delivery Fee</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>₦{order.deliveryprice.toFixed(1)}</td>
                      <td>{order.distance.toFixed(1)} km</td>
                      <td>{order.status}</td>
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
                            {/* <DropdownItem
                              onClick={() => handleViewOrder(order)}
                            >
                              View Order Details
                            </DropdownItem> */}
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
                              Update Status
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

export default RiderRunningOrders;
