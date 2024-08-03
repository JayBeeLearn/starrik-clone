import React, { useEffect, useContext, useState } from "react";
import { useLocation, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { GlobalContext } from "Globalstate.js";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/CompRiderSidebar";
 
import routes from "routes.js";
 


const CompanyRiders = (props) => {

  const navigate = useNavigate();
  const mainContent = React.useRef(null);
  const location = useLocation();
  const [{ userdetails, loggedin, tradingpair, distance }, dispatch] = useContext(GlobalContext);

  const [companyRidersDetails, setCompanyRidersDetails] = useState(null);
  console.log("Reload Check B", userdetails.uniqueId);




  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);



  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/companyriders") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
 
  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{ 
          innerLink: "/companyriders",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        
        <Routes> 
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/companyriders/companyridersindex" replace />} />
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default CompanyRiders;