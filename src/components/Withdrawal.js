import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap"; 
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const WithdrawalModal = ({ isOpen, toggle, riderData }) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleWithdrawal = async () => {
    const currentBalance = riderData.RiderBal;

    if (parseFloat(withdrawalAmount) > currentBalance) {
      setError("Withdrawal amount cannot exceed current balance.");

      return;
    }
    // Create withdrawal document
    console.log(riderData);
    console.log(riderData.id);
    // console.log(riderData.fullName);

    try {
      const withdrawalDocRef = await addDoc(collection(db, "withdrawals"), {
        riderId: riderData.id,
        withdrawalAmount: parseFloat(withdrawalAmount),
        date: new Date(),
        status: "pending",
        bankName: riderData.bankName,
        accountType: riderData.accountType,
        accountNumber: riderData.accountNumber,
        accountName: riderData.accountName,
        firstName: riderData.firstName,
        RiderBal: riderData.RiderBal,
      });
      // Deduct withdrawal amount from RiderBal
      const updatedBalance = currentBalance - parseFloat(withdrawalAmount);
      const riderDocRef = doc(db, "independentriders", riderData.id);
      await updateDoc(riderDocRef, { RiderBal: updatedBalance });
      setSuccess("Withdrawal request placed successfully.");
      setWithdrawalAmount("");
      setError("");
      window.location.reload();
      console.log('Chkpt 8')
    } catch (err) {
      setError("Error placing withdrawal request.");
      console.error("Error placing withdrawal request:", err);
    }
  };



  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Withdrawal Request</ModalHeader>
      <ModalBody>
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}
        <FormGroup>
          <Label for="withdrawalAmount">Withdrawal Amount (₦)</Label>
          <Input
            type="number"
            id="withdrawalAmount"
            placeholder="Enter withdrawal amount"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(e.target.value)}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleWithdrawal}>
          Submit
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default WithdrawalModal;
