import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardHeader, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Spinner } from 'reactstrap';
import axios from 'axios';
import Header from "components/Headers/SaisieHeader.js";
import { useNavigate } from 'react-router-dom';

const RakitraList = () => {
  const [rakitraList, setRakitraList] = useState([]);
  const [modificationModalOpen, setModificationModalOpen] = useState(false);
  const [suppressionModalOpen, setSuppressionModalOpen] = useState(false);
  const [selectedRakitra, setSelectedRakitra] = useState(null);
  const [initialBillets, setInitialBillets] = useState({});
  const [modifiedBillets, setModifiedBillets] = useState({});
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [description, setDescription] = useState('');
  const [caisses, setCaisses] = useState([]);
  const [selectedCaisse, setSelectedCaisse] = useState('');
  const [typeTransaction, setTypeTransaction] = useState(0);
  const [isLoadingBillets, setIsLoadingBillets] = useState(true);
  const [isLoadingCaisses, setIsLoadingCaisses] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchRakitraList = async () => {
      try {
        await axios.get('/sanctum/csrf-cookie');

        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('/api/rakitra', { headers });
        setRakitraList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des rakitra :', error);
      }
    };

    fetchRakitraList();
  }, []);

  const fetchInitialBillets = async (rakitraId) => {
    try {
      await axios.get('/sanctum/csrf-cookie');

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`/api/initial-billets/${rakitraId}`, { headers });
      setInitialBillets(response.data);
      setModifiedBillets(response.data);
      setIsLoadingBillets(false); // Les billets sont chargés
    } catch (error) {
      console.error('Erreur lors de la récupération des billets initiaux :', error);
    }
  };

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
      setIsLoadingCaisses(false); // Les caisses sont chargées
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste des caisses :', error);
    }
  };

  const handleModificationClick = (rakitra) => {
    setSelectedRakitra(rakitra);
    setIsLoadingBillets(true); // Commence le chargement des billets
    setIsLoadingCaisses(true); // Commence le chargement des caisses si nécessaire
    setIsLoadingButton(true); // Active le chargement du bouton
    fetchInitialBillets(rakitra.id);
    fetchCaisses();
    setDescription(rakitra.description || '');
    setTypeTransaction(rakitra.typetransaction || 0);
    setSelectedCaisse(rakitra.idcaisse || '');
    setModificationModalOpen(true);
  };

  const handleSuppressionClick = (rakitra) => {
    setSelectedRakitra(rakitra);
    setSuppressionModalOpen(true);
  };

  const handleModificationModalClose = () => {
    setModificationModalOpen(false);
    setIsLoadingButton(false);
  };

  const handleSuppressionModalClose = () => {
    setSuppressionModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      setDescription(value);
    } else if (name === "typeTransaction") {
      setTypeTransaction(parseInt(value, 10));
      if (parseInt(value, 10) === 0) {
        setSelectedCaisse(1); // Reset to default if Rakitra is selected
      }
    } else if (name === "caisse") {
      setSelectedCaisse(parseInt(value, 10));
    } else {
      setModifiedBillets({
        ...modifiedBillets,
        [name]: parseInt(value, 10),
      });
    }
  };

  // Fonction pour calculer le montant total à partir des billets modifiés
  const calculateTotalMontant = (billets) => {
    return (
      billets["100"] * 100 +
      billets["200"] * 200 +
      billets["500"] * 500 +
      billets["1000"] * 1000 +
      billets["2000"] * 2000 +
      billets["5000"] * 5000 +
      billets["10000"] * 10000 +
      billets["20000"] * 20000
    );
  };

  const handleSubmit = async () => {
    try {
      setIsLoadingRequest(true);

      // Calcul du montant total
      const totalMontant = calculateTotalMontant(modifiedBillets);

      await axios.get('/sanctum/csrf-cookie');

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Envoi de la requête pour la modification des billets
      const response = await axios.post(`/api/modification-billets/${selectedRakitra.id}`, {
        modifiedBillets: modifiedBillets,
        montantTotal: totalMontant,
        description: description,
        caisse: selectedCaisse,
        typetransaction: typeTransaction,
      }, { headers });

      setModificationModalOpen(false);

      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données :', error);
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

      // Envoi de la requête pour la suppression du Rakitra
      await axios.delete(`/api/rakitra/${selectedRakitra.id}`, { headers });

      const updatedList = rakitraList.filter((rakitra) => rakitra.id !== selectedRakitra.id);
      setRakitraList(updatedList);

      setSuppressionModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du rakitra :', error);
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

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Liste des Rakitra</h3>
              </CardHeader>
              <div className="table-responsive">
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Montant</th>
                      <th scope="col">Description</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rakitraList.map((rakitra) => (
                      <tr key={rakitra.id}>
                        <td>{formatDateTime(rakitra.datetransaction)}</td>
                        <td>{formatAmount(rakitra.montant)}</td>
                        <td>{rakitra.description}</td>
                        <td>
                        <Button color="primary" onClick={() => handleModificationClick(rakitra)} disabled={isLoadingButton}>
                          {isLoadingButton ? <Spinner size="sm" /> : 'Modifier'}
                        </Button>
                          <Button color="danger" onClick={() => handleSuppressionClick(rakitra)}>
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
      <Modal isOpen={modificationModalOpen && !isLoadingBillets && !isLoadingCaisses} toggle={handleModificationModalClose}>
        <ModalHeader>Modification Rakitra</ModalHeader>
        <ModalBody>
          {selectedRakitra && (
            <>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="typeTransaction">Type de Transaction</Label>
                <Input
                  type="select"
                  name="typeTransaction"
                  id="typeTransaction"
                  value={typeTransaction}
                  onChange={handleInputChange}
                >
                  <option value={0}>Rakitra</option>
                  <option value={3}>Procession</option>
                </Input>
              </FormGroup>
              {typeTransaction === 3 && (
                <FormGroup>
                  <Label for="caisse">Caisse</Label>
                  <Input
                    type="select"
                    name="caisse"
                    id="caisse"
                    value={selectedCaisse}
                    onChange={handleInputChange}
                  >
                    {caisses.map((caisse) => (
                      <option key={caisse.id} value={caisse.id}>
                        {caisse.nom}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              )}
              <Row>
                <Col md={6}>
                  {Object.entries(modifiedBillets).map(([billet, quantite]) => (
                    <FormGroup key={billet}>
                      <Label for={billet}>{`Billet de ${billet} Ar`}</Label>
                      <Input
                        type="number"
                        name={billet}
                        id={billet}
                        placeholder="0"
                        value={quantite}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  ))}
                </Col>
              </Row>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit} disabled={isLoadingRequest}>
            {isLoadingRequest ? <Spinner size="sm" /> : 'Valider'}
          </Button>
          <Button color="secondary" onClick={handleModificationModalClose}>
            Annuler
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal de suppression */}
      <Modal isOpen={suppressionModalOpen} toggle={handleSuppressionModalClose}>
        <ModalHeader>Suppression Rakitra</ModalHeader>
        <ModalBody>
          {selectedRakitra && (
            <p>Voulez-vous vraiment supprimer ce Rakitra ?</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleSuppressionSubmit} disabled={isLoadingRequest}>
            {isLoadingRequest ? <Spinner size="sm" /> : 'Oui'}
          </Button>
          <Button color="secondary" onClick={handleSuppressionModalClose}>
            Non
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default RakitraList;
