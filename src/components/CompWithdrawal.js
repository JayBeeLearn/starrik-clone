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
    Container,
    Row,
    Card,
    CardHeader,
    CardBody,

} from "reactstrap";
import { doc, updateDoc, collection, getDocs, where, query, addDoc } from "firebase/firestore";
import { db } from "../firebase";



const CompWithdrawalModal = ({ isOpen, toggle, companyData }) => {


    const [withdrawalAmount, setWithdrawalAmount] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleWithdrawal = async () => {
        const currentBalance = companyData.compBal;

        console.log('Chkpt 1')
        if (parseFloat(withdrawalAmount) > currentBalance) {
            setError("Withdrawal amount cannot exceed current balance.");
            console.log('Chkpt 2')

            return;
        }
        // Create withdrawal document
        console.log(companyData);
        console.log(companyData.id);
        // console.log(riderData.fullName);

        try {
            const withdrawalDocRef = await addDoc(collection(db, "withdrawals"), {

                withdrawalAmount: parseFloat(withdrawalAmount),
                date: new Date(),
                status: "pending",
                bankName: companyData.compBankName,
                accountType: companyData.compAccountType,
                accountNumber: companyData.compAccountNumber,
                accountName: companyData.compAccountName,
                firstName: companyData.compName,
                compBal: companyData.compBal,
                uniqueId: companyData.uniqueId,

            });
            console.log('Chkpt 5')
            // Deduct withdrawal amount from RiderBal
            const updatedBalance = currentBalance - parseFloat(withdrawalAmount);

            const companyQuery = query(collection(db, "company"), where("uniqueId", "==", companyData.uniqueId));

            const companySnapshot = await getDocs(companyQuery)

            if (!companySnapshot.empty) {

                const companyDocRef = companySnapshot.docs[0].ref;

                await updateDoc(companyDocRef, { compBal: updatedBalance });



                // const riderDocRef = doc(db, "company", companyData.uniqueId);


                console.log('Chkpt 6')
                setSuccess("Withdrawal request placed successfully.");
                console.log('Chkpt 7')
                setWithdrawalAmount("");
                setError("");
                window.location.reload();
                console.log('Chkpt 8')

            }
        } catch (err) {
            setError("Error placing withdrawal request.");
            console.error("Error placing withdrawal request:", err);
        }
    };



    return (
        <>


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





        </>
    );
};

export default CompWithdrawalModal;
