import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

const OrderDetailsModal = ({ order, toggleModal }) => {
  return (
    <Modal isOpen={true} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Order Details</ModalHeader>
      <ModalBody>
        <p>Order No: {order.id}</p>
        <p>Pickup Address: {order.pickupAddress}</p>
        <p>Delivery Address: {order.deliveryAddress}</p>
        <p>Distance: {order.distance.toFixed(1)} Km</p>
        <p>Price: ₦ {order.deliveryprice.toFixed(1)}</p>
        <p>Receiver Details: {order.receiverDetails}</p>
        <p>Delivery Details: {order.deliveryDetails}</p>
        <p>Status: {order.status} For Pickup</p>
        {/* <p>User phoneNumber: {order.userPhone}</p>
        <p>Rider phoneNumber: {order.riderphone}</p> */}
         <p>
          User Phone Number:{" "}
          <a href={`tel:${order.userPhone}`}>Call {order.userPhone}</a>
        </p>
        <p>
          Rider Phone Number:{" "}
          <a href={`tel:${order.riderphone}`}>Call {order.riderphone}</a>
        </p>
        {/* Add more details here */}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OrderDetailsModal;
