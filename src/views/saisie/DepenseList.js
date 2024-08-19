import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardHeader, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import Header from "components/Headers/SaisieHeader.js";
import { useNavigate } from 'react-router-dom';

const DepenseList = () => {
  const [DepenseList, setDepenseList] = useState([]);
  const [modificationModalOpen, setModificationModalOpen] = useState(false);
  const [suppressionModalOpen, setSuppressionModalOpen] = useState(false);
  const [selectedDepense, setSelectedDepense] = useState(null);
  const [initialTransaction, setInitialTransaction] = useState({});
  const [modifiedTransaction, setModifiedTransaction] = useState({});
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

  const navigate = useNavigate();

  // Déclarez fetchDepenseList en dehors de useEffect
  const fetchDepenseList = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie');

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get('/api/depense', { headers });
      setDepenseList(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste des Depense :', error);
    }
  };

  const [caisses, setCaisses] = useState([]);  // Nouvel état pour stocker les caisses disponibles

  const fetchCaisses = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie');

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Endpoint pour récupérer la liste des caisses
      const response = await axios.get('/api/caisses', { headers });

      setCaisses(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste des caisses :', error);
    }
  };

  useEffect(() => {
    fetchDepenseList();
    fetchCaisses();
  }, []);

  
  const fetchInitialTransaction = async (DepenseId) => {
    try {
      await axios.get('/sanctum/csrf-cookie');

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`/api/depense/${DepenseId}`, { headers });
      setInitialTransaction(response.data);
      setModifiedTransaction(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de la transaction initiale :', error);
    }
  };

  const handleModificationClick = (Depense) => {
    setSelectedDepense(Depense);
    fetchInitialTransaction(Depense.id);
    setModificationModalOpen(true);
  };

  const handleSuppressionClick = (Depense) => {
    setSelectedDepense(Depense);
    setSuppressionModalOpen(true);
  };

  const handleModificationModalClose = () => {
    setModificationModalOpen(false);
  };

  const handleSuppressionModalClose = () => {
    setSuppressionModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifiedTransaction({
      ...modifiedTransaction,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoadingRequest(true);

      await axios.get('/sanctum/csrf-cookie');

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.put(`/api/depense/${selectedDepense.id}`, modifiedTransaction, { headers });

      setModificationModalOpen(false);
      // Actualiser la liste des Depense
      fetchDepenseList();
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données de modification :', error);
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const handleSuppressionSubmit = async () => {
    try {
      setIsLoadingRequest(true);

      await axios.get('/sanctum/csrf-cookie');

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.delete(`/api/depense/${selectedDepense.id}`, { headers });

      // Actualiser la liste des Depense après suppression
      setDepenseList((prevList) => prevList.filter((Depense) => Depense.id !== selectedDepense.id));

      setSuppressionModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du Depense :', error);
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'MGA' });
  };

  // ... (autres fonctions utilitaires)

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Liste des Depense</h3>
              </CardHeader>
              <div className="table-responsive">
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Montant</th>
                      <th scope="col">Caisse</th>
                      <th scope="col">Raison</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DepenseList.map((Depense) => (
                      <tr key={Depense.id}>
                        <td>{formatDateTime(Depense.datetransaction)}</td>
                        <td>{formatAmount(Depense.montant)}</td>
                        <td>{Depense.caisse ? Depense.caisse.nom : 'Sans'}</td>
                        <td>{Depense.description}</td>
                        <td>
                          <Button color="primary" onClick={() => handleModificationClick(Depense)}>
                            Modifier
                          </Button>
                          <Button color="danger" onClick={() => handleSuppressionClick(Depense)}>
                            Supprimer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal de modification */}
      <Modal isOpen={modificationModalOpen} toggle={handleModificationModalClose}>
        <ModalHeader>Modification Depense</ModalHeader>
        <ModalBody>
          {selectedDepense && (
            <Row>
              <Col md={6}>
                {/* Ajustez le formulaire de modification en fonction de vos champs */}
                <FormGroup>
                  <Label for="montant">Montant</Label>
                  <Input
                    type="text"
                    name="montant"
                    id="montant"
                    placeholder="Montant"
                    value={modifiedTransaction.montant || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Description"
                    value={modifiedTransaction.description || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="caisse">Caisse</Label>
                  <Input
                    type="select"
                    name="idcaisse"
                    id="idcaisse"
                    value={modifiedTransaction.idcaisse || ''}
                    onChange={handleInputChange}
                  >
                    {/* Ajoutez les options avec les caisses disponibles */}
                    {caisses.map((caisse) => (
                      <option key={caisse.id} value={caisse.id}>
                        {caisse.nom}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                {/* ... (autres champs si nécessaire) */}
              </Col>
            </Row>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Valider
          </Button>
          <Button color="secondary" onClick={handleModificationModalClose}>
            Annuler
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal de suppression */}
      <Modal isOpen={suppressionModalOpen} toggle={handleSuppressionModalClose}>
        <ModalHeader>Suppression Depense</ModalHeader>
        <ModalBody>
          {selectedDepense && (
            <p>Voulez-vous vraiment supprimer ce Depense ?</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleSuppressionSubmit}>
            Oui
          </Button>
          <Button color="secondary" onClick={handleSuppressionModalClose}>
            Non
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DepenseList;
