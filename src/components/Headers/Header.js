import React, { useState, useEffect } from "react";
import { Alert, Container, Button } from "reactstrap";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Header = () => {
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
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
                setConfirmedOrder(orderData);
                setIsOpen(true);
              } else {
                setIsOpen(false);
              }
            });
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribeOrder();
  }, []);

  const handleAlertClose = () => {
    console.log("helooooooooooooooooooooooooooo")
    setIsOpen(false);
  };
  

  return (
    <>
      <div className="header bg-gradient-info pb-6 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Alert
              color="info"
              isOpen={isOpen}
              toggle={handleAlertClose}
              style={{ zIndex: 9999 }} // Set z-index here
              onClick={handleAlertClose}
            >
              {confirmedOrder && (
                <>
                  Order has been been picked and confirmed by rider: {confirmedOrder.distance.toFixed(1)} km - ₦
                  {(confirmedOrder.distance * 180).toFixed(1)}
                </>
              )}
              <Button close />
            </Alert>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
