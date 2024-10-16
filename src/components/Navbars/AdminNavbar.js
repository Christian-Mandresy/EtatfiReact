/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

import axios from 'axios';
import Cookies from 'js-cookie';

const AdminNavbar = (props) => {
  const handleLogout = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie');
        // Récupérer le token stocké
        const token = localStorage.getItem('token');
        console.log('token coté client ',token)
        
        // Configuration des headers avec le token
        const headers = {
          'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),
            Authorization: `Bearer ${token}`,
        };
        
        

        // Appel de l'API de déconnexion côté serveur
        const response = await axios.post('/api/logout', {}, { headers });
        console.log("headers : ",response.headers);

        // Effacer le token stocké côté client
        localStorage.removeItem('token');

        // Redirection vers la page de connexion 
        window.location.href = 'https://etatfi-react.vercel.app/';
    } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
    }
  };
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/team-4-800x800.jpg")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      Jessica Jones
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
