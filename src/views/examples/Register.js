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

// reactstrap components
import axios from "axios";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Label,
} from "reactstrap";



const Register = () => {

  const history=useNavigate();
  const [registerInput, setRegister] = useState({
    name: '',
    email: '',
    password: '',
    role: 'saisie', // Valeur par défaut du rôle
  });

  const [validationErrors, setValidationErrors] = useState({});
  
  // Gérer les changements de valeur des champs du formulaire
  const handleInput = (e) => {
    e.persist();
    setRegister((prevInput) => ({
      ...prevInput,
      [e.target.name]: e.target.value,
    }));
  };
  
  const registerSubmit = async (e) => {
    e.preventDefault();
  
    const data = {
      name: registerInput.name,
      email: registerInput.email,
      password: registerInput.password,
      role: registerInput.role,
    };
  
    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/api/register', data);
  
      // Enregistrez le token dans le localStorage
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('auth_user', response.data.user);
      // Succès : Traitez la réponse ici
      
      // Réinitialisez les erreurs après une soumission réussie
      setValidationErrors(null);
      history('/');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Erreurs de validation côté serveur
        const validationErrors = error.response.data.errors;
        // Affichez les erreurs dans votre interface utilisateur ou mettez-les dans l'état du composant
        setValidationErrors(validationErrors);
      } else {
        // Autres erreurs
        console.error('Erreur lors de l\'inscription :', error);
        // Affichez un message d'erreur générique à l'utilisateur ou redirigez-le vers une page d'erreur
      }
    }
  };

  return (
    <Col lg="6" md="8">
      <Card className="bg-secondary shadow border-0">
        <CardHeader className="bg-transparent pb-5" />
        <CardBody className="px-lg-5 py-lg-5">
          <Form role="form" onSubmit={registerSubmit}>
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-hat-3" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Name"
                  type="text"
                  name="name"
                  onChange={handleInput}
                  value={registerInput.name ?? ''} 
                />
                {/* Afficher les erreurs de validation */}
                {validationErrors.name && (
                  <div className="error-message">{validationErrors.name[0]}</div>
                )}
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Email"
                  type="email"
                  autoComplete="new-email"
                  name="email"
                  onChange={handleInput}
                  value={registerInput.email ?? ''}
                />
                {/* Afficher les erreurs de validation */}
                {validationErrors.email && (
                  <div className="error-message">{validationErrors.email[0]}</div>
                )}
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Password"
                  type="password"
                  autoComplete="new-password"
                  name="password"
                  onChange={handleInput}
                  value={registerInput.password ?? ''}
                />
                {/* Afficher les erreurs de validation */}
                {validationErrors.password && (
                  <div className="error-message">{validationErrors.password[0]}</div>
                )}
              </InputGroup>
            </FormGroup>
            <div className="text-muted font-italic">
              <small>
                password strength:{" "}
                <span className="text-success font-weight-700">strong</span>
              </small>
            </div>
            <Row className="my-4">
              <Col xs="12" />
            </Row>
            <FormGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-badge" />
                </InputGroupText>
              </InputGroupAddon>
              {/* Utilisez le composant FormSelect de reactstrap pour le champ de sélection du rôle */}
              <FormGroup>
              <Label for="role">Role</Label>
              <Input type="select" name="role" id="role" onChange={handleInput} value={registerInput.role}>
                <option value="admin">Admin</option>
                <option value="saisie">Saisie</option>
              </Input>
            </FormGroup>
            </InputGroup>
          </FormGroup>
            <div className="text-center">
              <Button className="mt-4" color="primary" type="submit">
                Create account
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
      
    </Col>
    
  );
};

export default Register;
