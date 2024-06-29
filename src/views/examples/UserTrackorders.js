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
import MapWithDirections from "components/MapwithDirection";
import Swal from "sweetalert2";
import Header from "components/Headers/Header.js";
import OrderDetailsModal from "components/OrderDetails";
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
  getDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import OrderConfirmationModal from "components/OrderConfirmationModal";
import { useNavigate } from "react-router-dom";
import TrackRider from "components/TrackRider";

const UserTrackorders = () => {
  const navigate = useNavigate();
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
            where("userid", "==", user.uid),
            // where("status", "==", "confirmed")
            where("status", "in", ["confirmed", "delivered", "pending"])
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
    console.log(order);
    setSelectedOrder(order);
    setPickupCoordinates(order.pickupCoordinates);
    setDeliveryCoordinates(order.deliveryCoordinates);
    toggleModal();
  };

  const handleTractorder = (order) => {
    console.log(order);
    setSelectedOrder(order);

    if (order.riderLocation==null){
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Order has not been picked!",
      });
    }else{
    //set riderlocation if it exits
    console.log(order.riderLocation)
    console.log(order.deliveryCoordinates)

    setPickupCoordinates({lng: order.riderLocation.longitude, lat: order.riderLocation.latitude});
    setDeliveryCoordinates(order.deliveryCoordinates);
    toggleModal();
    }
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

  // const confirmOrder = async (order) => {
  //   const result = await Swal.fire({
  //     title: "Confirm order delivery?",
  //     text: "Are you sure you want to confirm the delivery of this order?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, confirm!",
  //     cancelButtonText: "Cancel",
  //     reverseButtons: true,
  //   });
  //   if (result.isConfirmed) {
  //     const orderRef = doc(db, "order", order.id);
  //     try {
  //       await updateDoc(orderRef, {
  //         status: "userapproved",
  //         dateConfirmed: new Date(),
  //       });
  //       console.log("Order updated successfully!");
  //     } catch (error) {
  //       console.error("Error updating order:", error);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops...",
  //         text: "An error occurred while updating the order!",
  //       });
  //     }
  //   }
  // };

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

    // If the user confirms the action, update the order status and increase rider balance
    if (result.isConfirmed) {
      const orderRef = doc(db, "order", order.id);
      console.log(order.status);
      try {
        if (order.status === "userapproved") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Order already confirmed!",
          });
          return;
        }
        // Update order status
        await updateDoc(orderRef, {
          status: "userapproved",
          dateConfirmed: new Date(),
        });

        // Fetch rider document
        const riderDoc = await getDoc(
          doc(db, "independentriders", order.riderid)
        );
        if (riderDoc.exists()) {
          ///DEDUCT 30% FROM DELIVERY FEE
          ///DEDUCT 30% FROM DELIVERY FEE
          ///DEDUCT 30% FROM DELIVERY FEE
          ///DEDUCT 30% FROM DELIVERY FEE
          ///DEDUCT 30% FROM DELIVERY FEE
          ///DEDUCT 30% FROM DELIVERY FEE
          // Increase rider balance
          const riderData = riderDoc.data();
          // const updatedBalance = riderData.RiderBal + order.deliveryprice;
          const deductionAmount = order.deliveryprice * 0.3;
          const remainingAmount = order.deliveryprice - deductionAmount;
          const updatedBalance = riderData.RiderBal + remainingAmount;
          await updateDoc(doc(db, "independentriders", order.riderid), {
            RiderBal: updatedBalance,
          });
          console.log("Rider balance updated successfully!");
          navigate("/user/maps");
        } else {
          console.error("Rider document not found!");
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Rider document not found!",
          });
        }
        console.log("Order updated successfully!");
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

          <TrackRider
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
                <h3 className="text-white mb-0">Track Orders</h3>
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
                              onClick={() => handleTractorder(order)}
                            >
                              Track Rider
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

export default UserTrackorders;
