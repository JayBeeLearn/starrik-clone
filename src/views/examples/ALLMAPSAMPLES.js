
import React, { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const UserProfile = () => {
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  useEffect(() => {
    // Fetch user's current location using Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={{
        height: '400px',
        width: '100%',
      }}
      zoom={10}
      center={coordinates}
    >
      {coordinates.lat && (
        <Marker position={{ lat: coordinates.lat, lng: coordinates.lng }} />
      )}
    </GoogleMap>
  );
};

export default UserProfile;























import React, { useState, useEffect } from "react";
import { GoogleMap, Marker,DirectionsRenderer } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const UserProfile = () => {
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");

  useEffect(() => {
    // Fetch user's current location using Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  }, []);

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  return (
    <>
      <GoogleMap
        mapContainerStyle={{
          height: '400px',
          width: '100%',
        }}
        zoom={10}
        center={coordinates}
      >
        {coordinates.lat && (
          <Marker position={{ lat: coordinates.lat, lng: coordinates.lng }} />
        )}
      </GoogleMap>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Search Places...",
                className: "location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </>
  );
};

export default UserProfile;


























import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const UserProfile = () => {
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [originCoordinates, setOriginCoordinates] = useState({ lat: null, lng: null });
  const [destinationCoordinates, setDestinationCoordinates] = useState({ lat: null, lng: null });
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    // Fetch user's current location using Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOriginCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  }, []);

  const handleOriginSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setOriginAddress(value);
    setOriginCoordinates(latLng);
  };

  const handleDestinationSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setDestinationAddress(value);
    setDestinationCoordinates(latLng);
  };

  useEffect(() => {
    if (originCoordinates.lat && destinationCoordinates.lat) {
      const origin = new window.google.maps.LatLng(originCoordinates.lat, originCoordinates.lng);
      const destination = new window.google.maps.LatLng(destinationCoordinates.lat, destinationCoordinates.lng);
      const service = new window.google.maps.DistanceMatrixService();

      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: "DRIVING",
        },
        (response, status) => {
          if (status === "OK") {
            const distance = response.rows[0].elements[0].distance.text;
            setDistance(distance);
          } else {
            console.error("Error calculating distance:", status);
          }
        }
      );
    }
  }, [originCoordinates, destinationCoordinates]);

  return (
    <>
      <GoogleMap
        mapContainerStyle={{
          height: "400px",
          width: "100%",
        }}
        zoom={10}
        center={originCoordinates}
      >
        {originCoordinates.lat && <Marker position={originCoordinates} label="A" />}
        {destinationCoordinates.lat && <Marker position={destinationCoordinates} label="B" />}
        {originCoordinates.lat && destinationCoordinates.lat && (
          <DirectionsRenderer
            options={{ suppressMarkers: true }}
            directions={{
              routes: [
                {
                  legs: [
                    {
                      start_location: originCoordinates,
                      end_location: destinationCoordinates,
                    },
                  ],
                },
              ],
            }}
          />
        )}
      </GoogleMap>

      <PlacesAutocomplete
        value={originAddress}
        onChange={setOriginAddress}
        onSelect={handleOriginSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Origin",
                className: "location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>

      <PlacesAutocomplete
        value={destinationAddress}
        onChange={setDestinationAddress}
        onSelect={handleDestinationSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Destination",
                className: "location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>

      {distance && <p>Distance: {distance}</p>}
    </>
  );
};

export default UserProfile;



















// import { useState, useContext, useEffect } from "react";
// import { GlobalContext } from "Globalstate.js";
// import { useNavigate } from "react-router-dom";
// import {
//   Button,
//   Card,
//   CardHeader,
//   CardBody,
//   FormGroup,
//   Form,
//   Input,
//   Container,
//   Row,
//   Col,Alert
// } from "reactstrap";
// import UserHeader from "components/Headers/UserHeader.js";
// import { doc, updateDoc, getDoc } from "firebase/firestore";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
// import { db, auth } from "../../firebase";

// const UserProfile = () => {
//   const navigate = useNavigate();
//   const [{ userdetails, loggedin, tradingpair }, dispatch] =
//     useContext(GlobalContext);
//   const [loading, setLoading] = useState(true);

//   const [user, setUser] = useState({
//     username: "",
//     email: "",
//     firstName: "",
//     lastName: "",
//     address: "",
//     city: "",
//     country: "",
//     postalCode: "",
//   });
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   const [success2, setSuccess2] = useState(false);
//   const [error2, setError2] = useState(false);

//   //////////////////////////////////////////////////////
//   //////////////////////AUTHENTICATION///////////////////////////////
//   //////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////
//   //////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////

//   useEffect(() => {
//     // console.log("fetching UserId: ", auth.currentUser.uid)
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           setLoading(true);
//           // Get user details from Firestore
//           const userDoc = await getDoc(doc(db, "users", user.uid));
//           if (userDoc.exists()) {
//             // userDoc.data().id = user.uid;
//             setUser(userDoc.data());
//             setdetails({ ...userDoc.data(), id: user.uid });
//             // console.log(userDoc.data());
//             // setLoading(false);
//           } else {
//             console.log("User data not found in Firestore.");
//             // setLoading(false);
//             navigate("/auth/login");
//           }
//           // setModalOpen(true);
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           // setLoading(false);
//         }
//       } else {
//         // If user is not logged in, redirect to login page
//         // history.push("/login");
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const setdetails = (data) => {
//     dispatch({ type: "setuserdetails", snippet: data });
//   };

//   const setloggedin = (data) => {
//     dispatch({ type: "setloggedin", snippet: data });
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       // history.push("/login");
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };
//   //////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////
//   //////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////
//   //////////////////////////////////////////////////////
//   //////////////////////AUTHENTICATION///////////////////////////////
//   //////////////////////////////////////////////////////

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUser((prevUser) => ({
//       ...prevUser,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const userDocRef = doc(db, "users", userdetails.id); // Replace 'userId' with the actual user ID
//       await updateDoc(userDocRef, {
//         ...user,
//       });

//       setSuccess("Account updated successfully.");
//       setSuccess2(true);
//       setError2(false)
//       setError("");
//     } catch (err) {
//       setError("Error updating account.");
//       console.error("Error updating account:", err);
//       setSuccess2(false);
//       setError2(true)
//     }

//     window.location.reload();
//   };

//   const alertStyles = {
//     position: 'fixed',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     zIndex: '1000',
//     width: '100%',
//     maxWidth: '500px',
//     textAlign: 'center'
//   };

//   return (
//     <>
//       <UserHeader />
//       {success2 && (
//         <Alert color="success" style={alertStyles}>
//           {success}
//         </Alert>
//       )}

//       {/* Error Alert */}
//       {error2 && (
//         <Alert color="danger" style={alertStyles}>
//           {error}
//         </Alert>
//       )}
//       <Container className="mt--7" fluid>
//         <Row>
//           <Col className="order-xl-1" xl="8">
//             <Card className="bg-secondary shadow">
//               <CardHeader className="bg-white border-0">
//                 <Row className="align-items-center">
//                   <Col xs="8">
//                     <h3 className="mb-0">My account</h3>
//                   </Col>
//                   <Col className="text-right" xs="4">
//                     <Button
//                       color="primary"
//                       href="#pablo"
//                       onClick={(e) => e.preventDefault()}
//                       size="sm"
//                     >
//                       Settings
//                     </Button>
//                   </Col>
//                 </Row>
//               </CardHeader>
//               <CardBody>
//                 <Form onSubmit={handleSubmit}>
//                   <h6 className="heading-small text-muted mb-4">
//                     User information
//                   </h6>
//                   <div className="pl-lg-4">
//                     {/* ... */}
//                     <Row>
//                       <Col lg="6">
//                         <FormGroup>
//                           <label
//                             className="form-control-label"
//                             htmlFor="input-username"
//                           >
//                             Username
//                           </label>
//                           <Input
//                             className="form-control-alternative"
//                             name="username"
//                             value={user.username}
//                             onChange={handleChange}
//                             id="input-username"
//                             type="text"
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col lg="6">
//                         <FormGroup>
//                           <label
//                             className="form-control-label"
//                             htmlFor="input-email"
//                           >
//                            Address
//                           </label>
//                           <Input
//                             className="form-control-alternative"
//                             name="address"
//                             value={user.address}
//                             onChange={handleChange}
//                             id="input-address"
//                             type="text"
//                           />
//                         </FormGroup>
//                       </Col>
//                     </Row>
//                     {/* ... */}
//                   </div>
//                   <hr className="my-4" />
//                   <div className="text-center">
//                     <Button color="primary" type="submit">
//                       Update Account
//                     </Button>
//                   </div>
//                 </Form>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default UserProfile;




import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const UserProfile = () => {
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [originCoordinates, setOriginCoordinates] = useState({ lat: null, lng: null });
  const [destinationCoordinates, setDestinationCoordinates] = useState({ lat: null, lng: null });
  const [distance, setDistance] = useState(null);
  const [directions, setDirections] = useState(null);



  const handleOriginSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setOriginAddress(value);
    setOriginCoordinates(latLng);
    setDirections(null);
  };

  const handleDestinationSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setDestinationAddress(value);
    setDestinationCoordinates(latLng);
    setDirections(null);
  };


  useEffect(() => {
    // Fetch user's current location using Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOriginCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  }, []);
  
  useEffect(() => {
    if (originCoordinates.lat && destinationCoordinates.lat) {
      const origin = new window.google.maps.LatLng(originCoordinates.lat, originCoordinates.lng);
      const destination = new window.google.maps.LatLng(destinationCoordinates.lat, destinationCoordinates.lng);
      const service = new window.google.maps.DistanceMatrixService();

      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: "DRIVING", // Specify the travel mode here
        },
        (response, status) => {
          if (status === "OK") {
            const distance = response.rows[0].elements[0].distance.text;
            setDistance(distance);
            calculateDirections(origin, destination); // Calculate directions once distance is obtained
          } else {
            console.error("Error calculating distance:", status);
          }
        }
      );
    }
  }, [originCoordinates, destinationCoordinates]);

  const calculateDirections = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: "DRIVING", // Specify the travel mode here as well
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  return (
    <>
      <GoogleMap
        mapContainerStyle={{
          height: "400px",
          width: "100%",
        }}
        zoom={10}
        center={originCoordinates}
      >
        {originCoordinates.lat && <Marker position={originCoordinates} label="pickup" />}
        {destinationCoordinates.lat && <Marker position={destinationCoordinates} label="destination" />}
        {directions && (
          <DirectionsRenderer
            options={{ suppressMarkers: true }}
            directions={directions}
          />
        )}
      </GoogleMap>

      <PlacesAutocomplete
        value={originAddress}
        onChange={setOriginAddress}
        onSelect={handleOriginSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Origin",
                className: "location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>

      <PlacesAutocomplete
        value={destinationAddress}
        onChange={setDestinationAddress}
        onSelect={handleDestinationSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Destination",
                className: "location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>

      {distance && <p>Distance: {distance}</p>}
    </>
  );
};

export default UserProfile;









