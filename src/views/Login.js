import React, { useState } from 'react';
import axios from 'axios';
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
  Alert,
  Modal, ModalHeader, ModalBody,
} from 'reactstrap';

const Login = () => {

  const history=useNavigate();
  const [modal, setModal] = useState(false);
  const [loginInput, setLoginInput] = useState({
    email: '',
    password: '',
    role: 'saisie',
  });
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Ajout de l'état isLoading

  const handleInput = (e) => {
    setLoginInput({
      ...loginInput,
      [e.target.name]: e.target.value,
    });
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Activer le chargement au début de la requête
  
    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/api/login', loginInput);
      

     console.log(response.data);

      // Extrait le token et le rôle de la réponse
      const { token, role } = response.data;

      // Stocke le token dans le localStorage ou les cookies
        localStorage.setItem('token', token);
        localStorage.setItem('user_role', role);

      console.log(response.data);

  
      if (role === 'admin') {
        // Mettez à jour le rôle de l'utilisateur dans le state parent (userRole est passé en tant que prop depuis App.js
        // Redirigez vers la page d'administration pour les utilisateurs avec le rôle 'admin'
        history('/admin/recap');
      } else if (role === 'saisie') {
        // Redirigez vers la page de saisie pour les utilisateurs avec le rôle 'saisie'
        history('/saisie/comptage');
      } else {
        // Si le rôle de l'utilisateur n'est ni 'admin' ni 'saisie', affichez un message d'erreur ou gérez-le selon votre cas d'utilisation
        console.error('Rôle d\'utilisateur non pris en charge :', response.data.role);
        // Affichez un message d'erreur ou redirigez l'utilisateur vers une page d'erreur
      }
      
      // Réinitialisez les erreurs après une connexion réussie
      setErrors(null);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Affichez le modal en cas d'accès non autorisé (statut 401)
        setModal(true);
      } else if (error.response && error.response.status === 422) {
        // Erreurs de validation côté serveur
        const validationErrors = error.response.data.errors;
        // Mettez les erreurs dans l'état pour les afficher dans l'interface utilisateur
        setErrors(validationErrors);
      } else {
        // Autres erreurs
        console.error('Erreur lors de la connexion :', error);
        
        // Affichez un message d'erreur générique à l'utilisateur ou redirigez-le vers une page d'erreur
      }
      setIsLoading(false);
    }
  };

    return (
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            {/* ... */}
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            {/* Affichez les messages d'erreur ici */}
            {errors && (
              <Alert color="danger">
                {Object.values(errors).map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </Alert>
            )}
            {/* ... */}
            <Form role="form" onSubmit={handleLogin}>
              <FormGroup className="mb-3">
                {/* ... */}
                <Input
                  placeholder="Email"
                  type="email"
                  autoComplete="new-email"
                  name="email"
                  value={loginInput.email}
                  onChange={handleInput}
                />
                {/* Affichez les erreurs de validation pour l'email */}
                {errors && errors.email && <p className="text-danger">{errors.email[0]}</p>}
              </FormGroup>
              <FormGroup>
                {/* ... */}
                <Input
                  placeholder="Password"
                  type="password"
                  autoComplete="new-password"
                  name="password"
                  value={loginInput.password}
                  onChange={handleInput}
                />
                {/* Affichez les erreurs de validation pour le mot de passe */}
                {errors && errors.password && <p className="text-danger">{errors.password[0]}</p>}
              </FormGroup>
              {/* ... */}

              {/* Champ de sélection du rôle */}
              <FormGroup>
                <Input type="select" name="role" value={loginInput.role} onChange={handleInput}>
                  <option value="admin">Admin</option>
                  <option value="saisie">Saisie</option>
                </Input>
              </FormGroup>
              {/* ... */}
              <div className="text-center">
              {/* Affichez le bouton de chargement s'il y a un chargement en cours */}
              {isLoading ? (
                <Button className="my-4" color="primary" type="button" disabled>
                  Chargement...
                </Button>
              ) : (
                // Sinon, affichez le bouton de connexion
                <Button className="my-4" color="primary" type="submit">
                  Sign in
                </Button>
              )}
            </div>
            </Form>
          </CardBody>
          {/* ... */}
        </Card>
        {/* ... */}
          <Modal isOpen={modal} toggle={() => setModal(false)}>
          <ModalHeader toggle={() => setModal(false)}>Accès non autorisé</ModalHeader>
          <ModalBody>
            Vous n'êtes pas autorisé à accéder à cette ressource. Veuillez vérifier vos informations de connexion et réessayer.
          </ModalBody>
        </Modal>
      </Col>
    );
};

export default Login;
