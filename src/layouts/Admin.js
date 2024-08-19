import React, { useEffect, useState } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/SidebarSaisie.js";
import HeaderAdmin from "components/Headers/HeaderAdmin";
import axios from "axios";
import { Spinner } from 'reactstrap';
import routes from "adminRoutes.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get('/sanctum/csrf-cookie');
        const token = localStorage.getItem('token');
        const response = await axios.get('api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const role = response.data.role;
        setUserRole(role);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la validation du token :', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
      </Container>
    );
  }

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (props.location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
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
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <HeaderAdmin />
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={userRole === 'admin' ? <route.component /> : <Navigate to="/auth/login" replace />}
            />
          ))}
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
