import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "Globalstate.js";
import { useNavigate } from "react-router-dom";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";



// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

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
  limit,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import CompWithdrawalModal from "components/CompWithdrawal";

const CompIndex = (props) => {


  console.log('CKPT 1')
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [{ userdetails, loggedin, tradingpair }, dispatch] = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);

  console.log('CKPT 2')

  //////////////////////////////////////////////////////
  //////////////////////AUTHENTICATION///////////////////////////////
  //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // useEffect(() => {
  //   // Run window.location.reload() once when the component mounts
  //   window.location.reload();
  // }, []); 

  useEffect(() => {
    console.log('CKPT 3')
    // console.log("fetching UserId: ", auth.currentUser.uid)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {

        console.log('CKPT 4')
        try {
          console.log('CKPT 5')
          setLoading(true);
          console.log('CKPT 6')
          // Get user details from Firestore
          const userDoc = await getDoc(doc(db, "company", user.uid));
          console.log('CKPT 7')
          if (userDoc.exists()) {
            console.log('CKPT 8')
            // userDoc.data().id = user.uid;
            setdetails({ ...userDoc.data(), id: user.uid });

            console.log('CKPT 9')
            console.log(userDoc.data());
            setLoading(false);
          } else {
            console.log("User data not found in Firestore.");
            setLoading(false);
            console.log('CKPT 10')
            navigate("/auth/login");
          }
          // setModalOpen(true);
        } catch (error) {
          console.error("Error fetching user data:", error);

          console.log('CKPT 11')
          setLoading(false);
        }
      } else {
        // If user is not logged in, redirect to login page
        // history.push("/login");
        navigate("/auth/login");
        console.log('CKPT 12')
      }
    });
    console.log('CKPT 13')
    return () => unsubscribe();
    console.log('CKPT 13a')

  }, []);

  const setdetails = (data) => {
    dispatch({ type: "setuserdetails", snippet: data });
  };

  const setloggedin = (data) => {
    dispatch({ type: "setloggedin", snippet: data });
  };

  const handleLogout = async () => {
    try {
      console.log('CKPT 14')
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

  ////////////////////////////////////chart data/////////////////////////////////////
  ////////////////////////////////////chart data/////////////////////////////////////
  ////////////////////////////////////chart data/////////////////////////////////////
  ////////////////////////////////////chart data/////////////////////////////////////
  ////////////////////////////////////chart data/////////////////////////////////////
  ////////////////////////////////////chart data/////////////////////////////////////
  ////////////////////////////////////chart data/////////////////////////////////////

  const [chartData, setChartData] = useState(null);
  console.log('CKPT 15')
  useEffect(() => {
    console.log('15a')
    const generateChartData = async (riderId) => {
      const orderCollectionRef = collection(db, "order");

      console.log('CKPT 16')
      try {
        const ordersSnapshot = await getDocs(
          query(
            orderCollectionRef,
            where("riderid", "==", riderId),
            orderBy("dateCreated", "asc")
          )
        );

        console.log('CKPT 17')

        const monthlyCounts = {
          Jan: 0,
          Feb: 0,
          Mar: 0,
          Apr: 0,
          May: 0,
          Jun: 0,
          Jul: 0,
          Aug: 0,
          Sep: 0,
          Oct: 0,
          Nov: 0,
          Dec: 0,
        };
        console.log('CKPT 18')
        ordersSnapshot.forEach((doc) => {
          const order = doc.data();
          const date = new Date(order.dateCreated.toDate());
          const month = date.toLocaleString("default", { month: "short" });
          monthlyCounts[month] += 1;
        });

        console.log('CKPT 19')

        const data = {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Orders",
              data: [
                monthlyCounts.Jan,
                monthlyCounts.Feb,
                monthlyCounts.Mar,
                monthlyCounts.Apr,
                monthlyCounts.May,
                monthlyCounts.Jun,
                monthlyCounts.Jul,
                monthlyCounts.Aug,
                monthlyCounts.Sep,
                monthlyCounts.Oct,
                monthlyCounts.Nov,
                monthlyCounts.Dec,
              ],
              maxBarThickness: 10,
            },
          ],
        };
        setChartData(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const riderId = user.uid; // Replace with actual current user's ID
          generateChartData(riderId);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      } else {
        // If user is not logged in, redirect to login page
        // history.push("/login");
      }
    });
  }, []);

  ////////////////////////////////////chart data/////////////////////////////////////
  ////////////////////////////////////chart data/////////////////////////////////////
  ////////////////////////////////////chart data/////////////////////////////////////
  ////////////////////////////////////chart data/////////////////////////////////////
  ////////////////////////////////////chart data/////////////////////////////////////
  ////////////////////////////////////chart data/////////////////////////////////////
  ////////////////////////////////////chart data/////////////////////////////////////

  //////////////////////////////////////table data///////////////////////////////////
  //////////////////////////////////////table data///////////////////////////////////
  //////////////////////////////////////table data///////////////////////////////////
  //////////////////////////////////////table data///////////////////////////////////
  //////////////////////////////////////table data///////////////////////////////////


  const [orders, setOrders] = useState([]);
  console.log('CHPT A')

  useEffect(() => {
    const fetchRiderOrders = async (riderId) => {
      // Replace with actual current user's ID
      const orderCollectionRef = collection(db, "order");

      try {
        const ordersSnapshot = await getDocs(
          query(
            orderCollectionRef,
            where("riderid", "==", riderId),
            where("status", "==", "userapproved"),
            orderBy("dateCreated", "desc"),
            limit(20)
          )
        );

        const fetchedOrders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const riderId = user.uid; // Replace with actual current user's ID
          console.log("User rider ", riderId)
          fetchRiderOrders(riderId);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      } else {
        // If user is not logged in, redirect to login page
        // history.push("/login");
      }
    });
  }, []);

  useEffect(() => {
  // Function to calculate total riderBal for a specific company and update compBal
  const calculateAndUpdateCompBal = async (companyId) => {

    try {

      const ordersRef = collection(db, "companyriderslog");

      const q = query(ordersRef, where("uniqueId", "==", companyId));

      const querySnapshot = await getDocs(q);
      let riderBalList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        riderBalList.push(data.RiderBal);

      });
      console.log("RiderBal list:", riderBalList)
      const newRiderBal = riderBalList.reduce((acc, bal) => acc + bal, 0);




      const companyQuery = query(collection(db, "company"), where("uniqueId", "==", companyId));

      const companySnapshot = await getDocs(companyQuery);


      if (!companySnapshot.empty) {
        const companyDocRef = companySnapshot.docs[0].ref;

        const companyDocSnapshot = await getDoc(companyDocRef);

        const CompanyDoc = companyDocSnapshot.data()
        const totalRiderBal = newRiderBal + CompanyDoc.compBal


        await updateDoc(companyDocRef, {
          compBal: totalRiderBal

        });

        for (const docSnapshot of querySnapshot.docs) {
          const docRef = docSnapshot.ref;
          await updateDoc(docRef, {
            RiderBal: 0
          });
        }


        // querySnapshot.forEach((doc) => {
        //   const data = doc.data();
        //   await updateDoc(data, {
        //     RiderBal: 0
        //   });
        console.log(`Updated compBal for company ${companyId}: ${userdetails.compName} to ${totalRiderBal}`);
      } else {
        console.log("No matching company document found");
      }



    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error updating compBal:", error);
    }
  };

  if (userdetails && userdetails.uniqueId) {
    const companyId = userdetails.uniqueId;
    calculateAndUpdateCompBal(companyId);
  }

}, [userdetails]);




  //////////////////////////////////////table data///////////////////////////////////
  //////////////////////////////////////table data///////////////////////////////////
  //////////////////////////////////////table data///////////////////////////////////
  //////////////////////////////////////table data///////////////////////////////////
  //////////////////////////////////////table data///////////////////////////////////

  //////////////////////////////withdrawal////////////////////////////////////
  //////////////////////////////withdrawal////////////////////////////////////
  //////////////////////////////withdrawal////////////////////////////////////
  const [isOpen, setIsOpen] = useState(false);
  const [riderData, setRiderData] = useState(null);
  console.log('CHPT b')

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  console.log('CHPT c')

  //////////////////////////////withdrawal////////////////////////////////////
  //////////////////////////////withdrawal////////////////////////////////////
  //////////////////////////////withdrawal////////////////////////////////////

  if (window.Chart) {
    console.log('CHPT D')

    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    console.log('CHPT E')

    e.preventDefault();
    setActiveNav(index);
    console.log('CHPT F')

    setChartExample1Data("data" + index);
  };

  console.log("User ", userdetails)
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col xl="8">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">
                      Account Bal :NGN {userdetails.compBal}

                    </h2>
                    {/* Button to open the withdrawal modal */}
                    <Button color="primary" onClick={toggleModal}>Place Withdrawal</Button>

                    {/* Render the withdrawal modal */}
                    <CompWithdrawalModal
                      isOpen={isOpen}
                      toggle={toggleModal}
                      companyData={userdetails}
                    />

                    <h2 className="mb-0">Total orders</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  {chartData &&

                    <Bar
                      data={chartData}
                      // data={chartExample2.data}
                      options={chartExample2.options}
                    />}

                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* <Row className="mt-5"> */}
        {/* <Col className="mb-5 mb-xl-0" xl="8"> */}
        {/* <Card className="shadow"> */}
        {/* <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Completed Orders</h3>
                  </div>
                </Row>
              </CardHeader> */}
        {/* <Table className="align-items-center table-flush" responsive> */}
        {/* <thead className="thead-light"> */}
        {/* <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Delivery Fee</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Date Created</th>
                  </tr> */}
        {/* </thead> */}
        {/* <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <th scope="row">{order.id}</th>
                      <td>₦{order.deliveryprice.toFixed(1)}</td>
                      <td>{order.distance.toFixed(1)} km</td>
                      <td>
                        {new Date(
                          order.dateCreated.toDate()
                        ).toLocaleDateString()}
                      </td>
                     
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card> */}
        {/* </Col> */}
        {/* </Row> */}


      </Container>
    </>
  );
};

export default CompIndex;
