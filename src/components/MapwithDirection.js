import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "Globalstate.js";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

const MapWithDirections = ({ originCoordinates, destinationCoordinates }) => {
  const [{ userdetails, loggedin, tradingpair }, dispatch] =
    useContext(GlobalContext);
  const [loading, setLoading] = useState(true);

  const setdistance = (data) => {
    dispatch({ type: "setdistance", snippet: data });
  };

  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Fetch user's current location using Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
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
      const origin = new window.google.maps.LatLng(
        originCoordinates.lat,
        originCoordinates.lng
      );
      const destination = new window.google.maps.LatLng(
        destinationCoordinates.lat,
        destinationCoordinates.lng
      );
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
            setdistance(parseFloat(distance));
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
    <div>
      <GoogleMap
        mapContainerStyle={{
          height: "50vh",
          width: "100%",
        }}
        zoom={10}
        center={userLocation || originCoordinates}
      >
        {userLocation && (
          <Marker position={userLocation} label="You are here" />
        )}
        {originCoordinates.lat && (
          <Marker position={originCoordinates} label="pickup" />
        )}
        {destinationCoordinates.lat && (
          <Marker position={destinationCoordinates} label="destination" />
        )}
        {directions && (
          <DirectionsRenderer
            options={{ suppressMarkers: true }}
            directions={directions}
          />
        )}
      </GoogleMap>
      {distance && <p>Distance: {distance}</p>}
    </div>
  );
};

export default MapWithDirections;

// import React, { useState, useEffect } from "react";
// import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

// const MapWithDirections = ({ originCoordinates, destinationCoordinates }) => {
//   const [directions, setDirections] = useState(null);
//   const [distance, setDistance] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);

//   useEffect(() => {
//     // Fetch user's current location using Geolocation API
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       },
//       (error) => {
//         console.error("Error getting user's location:", error);
//       }
//     );
//   }, []);

//   useEffect(() => {
//     if (originCoordinates.lat && destinationCoordinates.lat) {
//       const origin = new window.google.maps.LatLng(originCoordinates.lat, originCoordinates.lng);
//       const destination = new window.google.maps.LatLng(destinationCoordinates.lat, destinationCoordinates.lng);
//       const service = new window.google.maps.DistanceMatrixService();

//       service.getDistanceMatrix(
//         {
//           origins: [origin],
//           destinations: [destination],
//           travelMode: "DRIVING", // Specify the travel mode here
//         },
//         (response, status) => {
//           if (status === "OK") {
//             const distance = response.rows[0].elements[0].distance.text;
//             setDistance(distance);
//             calculateDirections(origin, destination); // Calculate directions once distance is obtained
//           } else {
//             console.error("Error calculating distance:", status);
//           }
//         }
//       );
//     }
//   }, [originCoordinates, destinationCoordinates]);

//   const calculateDirections = (origin, destination) => {
//     const directionsService = new window.google.maps.DirectionsService();

//     directionsService.route(
//       {
//         origin: origin,
//         destination: destination,
//         travelMode: "DRIVING", // Specify the travel mode here as well
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirections(result);
//         } else {
//           console.error("Directions request failed:", status);
//         }
//       }
//     );
//   };

//   return (
//     <GoogleMap
//       mapContainerStyle={{
//         height: "400px",
//         width: "100%",
//       }}
//       zoom={10}
//       center={userLocation || originCoordinates}
//     >
//       {userLocation && <Marker position={userLocation} label="You are here" />}
//       {originCoordinates.lat && <Marker position={originCoordinates} label="pickup" />}
//       {destinationCoordinates.lat && <Marker position={destinationCoordinates} label="destination" />}
//       {directions && (
//         <DirectionsRenderer
//           options={{ suppressMarkers: true }}
//           directions={directions}
//         />
//       )}
//     </GoogleMap>
//   );
// };

// export default MapWithDirections;
