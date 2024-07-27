import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "Globalstate.js";
import { useNavigate } from "react-router-dom";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import Header from "components/Headers/Header.js";
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
import WithdrawalModal from "components/Withdrawal";

const CompanyRidersIndex = (props) => {

  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [{ userdetails, loggedin, tradingpair }, dispatch] = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);


  /////////////////////////////////////////////////////
     ///////////////AUTHENTICATION/////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////

 

  useEffect(() => {
    // console.log("fetching UserId: ", auth.currentUser.uid)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {

        try {
          setLoading(true);
          // Get user details from Firestore
          const userDoc = await getDoc(doc(db, "companyriderslog", user.uid));
          if (userDoc.exists()) {
            // userDoc.data().id = user.uid;
            setdetails({ ...userDoc.data(), id: user.uid });

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


  //////////////////////////////////AUTHENTICATION//////////////////////////////////////////

  ////////////////////////////////////chart data/////////////////////////////////////
  ////////////////////////////////////chart data/////////////////////////////////////


  const [chartData, setChartData] = useState(null);

  useEffect(() => {

    const generateChartData = async (riderId) => {
      const orderCollectionRef = collection(db, "order");


      try {
        const ordersSnapshot = await getDocs(
          query(
            orderCollectionRef,
            where("riderid", "==", riderId),
            orderBy("dateCreated", "asc")
          )
        );


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
  /////////////////////////////table data///////////////////////////////////
  /////////////////////////////table data///////////////////////////////////
  /////////////////////////////table data///////////////////////////////////

  /////////////////////////////withdrawal////////////////////////////////////
  /////////////////////////////withdrawal////////////////////////////////////
  /////////////////////////////withdrawal////////////////////////////////////


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
                      Account Bal :NGN {userdetails.RiderBal}
                    </h2>
                    {/* Button to open the withdrawal modal */}
                    <div>I have taken away withdrawal placement</div>
                    {/* <Button color="primary" onClick={toggleModal}>Place Withdrawal</Button> */}

                    {/* Render the withdrawal modal */}
                    <WithdrawalModal
                      isOpen={isOpen}
                      toggle={toggleModal}
                      riderData={userdetails}
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
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Completed Orders</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Delivery Fee</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Date Created</th>
                    {/* Add more columns if needed */}
                  </tr>
                </thead>
                <tbody>
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
                      {/* Convert Firebase Timestamp to Date and format it */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
         
        </Row>
      </Container>
    </>
  );
};

export default CompanyRidersIndex;
