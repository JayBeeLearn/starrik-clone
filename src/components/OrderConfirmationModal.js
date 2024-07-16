import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const OrderConfirmationModal = ({ isOpen, toggle, order, confirmOrder }) => {
  
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Confirm Order</ModalHeader>
      <ModalBody>
        {/* Display order details here */}
        <p>Order ID: {order.id}</p>
        <p>Delivery Fee: ₦{order.deliveryprice.toFixed(1)}</p>
        <p>Distance: {order.distance.toFixed(1)} km</p>
        {/* Add more details as needed */}
      </ModalBody>
      <ModalFooter> 
        <Button color="primary" onClick={() => confirmOrder(order)}>
          Confirm
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OrderConfirmationModal;
