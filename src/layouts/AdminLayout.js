import React, { useEffect, useState } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/SidebarSaisie.js";
import HeaderAdmin from "components/Headers/HeaderAdmin";

import axios from "axios";
import {  Spinner } from 'reactstrap';

import routes from "adminRoutes.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Effectuez la première requête pour obtenir le cookie CSRF
        await axios.get('/sanctum/csrf-cookie');

        // Effectuez la deuxième requête avec le cookie CSRF inclus dans les en-têtes
        const token = localStorage.getItem('token');
        const response = await axios.get('api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Récupérez et stockez le rôle de l'utilisateur
        const role = response.data.role;
        setUserRole(role);

        // Fin du chargement, définissez isLoading à false
        setIsLoading(false);

        // Le reste du traitement peut être effectué ici après que les requêtes sont terminées
      } catch (error) {
        // Gérez les erreurs en cas d'échec de la validation du token ou de toute autre erreur
        console.error('Erreur lors de la validation du token :', error);
        setIsLoading(false);
        // Vous pouvez également rediriger l'utilisateur vers la page de connexion si nécessaire
      }
    };

    fetchData(); // Appelez la fonction asynchrone
  }, []); // Le tableau vide [] signifie que useEffect s'exécutera une fois après le montage initial

  


  React.useEffect(() => {

  }, [location]);

  // Si isLoading est true, affichez un indicateur de chargement ou autre chose
  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
      </Container>
    );
  }

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !== -1
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
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar brandText={getBrandText(location.pathname)} />
        <HeaderAdmin />
        <Container fluid>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={userRole === 'admin' ? <route.component /> : <Navigate to="/auth/login" replace />}
              />
            ))}
          </Routes>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
