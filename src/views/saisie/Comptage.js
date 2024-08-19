import React, { useState, useEffect } from 'react';
import { FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Comptage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [billets, setBillets] = useState({
    billet100: 0,
    billet200: 0,
    billet500: 0,
    billet1000: 0,
    billet2000: 0,
    billet5000: 0,
    billet10000: 0,
    billet20000: 0,
  });

  const [recapitulatif, setRecapitulatif] = useState(null);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [caisse, setCaisse] = useState('');
  const [caisses, setCaisses] = useState([]); // Nouvel état pour stocker les caisses disponibles
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchCaisses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillets({
      ...billets,
      [name]: parseInt(value, 10),
    });
  };

  const handleTypeChange = (e) => {
    setTransactionType(e.target.value);
    if (e.target.value !== 'procession') {
      setCaisse('');
    }
  };

  const handleCaisseChange = (e) => {
    setCaisse(e.target.value);
  };

  const showRecapitulatif = () => {
    const totalMontant = calculateTotalMontant(billets);
    setRecapitulatif({
      ...billets,
      totalMontant: totalMontant,
    });
    setModalOpen(true);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setIsLoadingRequest(true);
      await axios.get('/sanctum/csrf-cookie');
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post('/api/rakitra', {
        totalMontant: calculateTotalMontant(billets),
        billets: billets,
        description: description,
        type: transactionType === 'rakitra' ? 0 : 3, // 0 pour rakitra, 3 pour procession
        caisse: transactionType === 'procession' ? caisse : 1 // 1 par défaut pour rakitra
      }, { headers });

      console.log(response.data);
      setModalOpen(false);
      navigate('/saisie/liste-rakitra');
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données :', error);
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const calculateTotalMontant = (billets) => {
    return (
      billets.billet100 * 100 +
      billets.billet200 * 200 +
      billets.billet500 * 500 +
      billets.billet1000 * 1000 +
      billets.billet2000 * 2000 +
      billets.billet5000 * 5000 +
      billets.billet10000 * 10000 +
      billets.billet20000 * 20000
    );
  };

  return (
    <>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#6699ff', padding: '20px', borderRadius: '10px', color: 'black' }}>
        <h2 style={{ textAlign: 'center' }}>Comptage de Billets</h2>

        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="textarea"
            name="description"
            id="description"
            placeholder="Ajouter une description"
            value={description}
            onChange={handleDescriptionChange}
          />
        </FormGroup>

        <FormGroup>
          <Label for="transactionType">Type de Transaction</Label>
          <Input type="select" name="transactionType" id="transactionType" value={transactionType} onChange={handleTypeChange}>
            <option value="">--Sélectionnez un type--</option>
            <option value="rakitra">Rakitra</option>
            <option value="procession">Procession</option>
          </Input>
        </FormGroup>

        {transactionType === 'procession' && (
          <FormGroup>
            <Label for="caisse">Caisse</Label>
            <Input type="select" name="caisse" id="caisse" value={caisse} onChange={handleCaisseChange}>
              <option value="">--Sélectionnez une caisse--</option>
              {caisses.map((caisse) => (
                <option key={caisse.id} value={caisse.id}>{caisse.nom}</option>
              ))}
            </Input>
          </FormGroup>
        )}

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="billet100">Billet de 100 Ar</Label>
              <Input
                type="number"
                name="billet100"
                id="billet100"
                placeholder="0"
                value={billets.billet100}
                onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="billet200">Billet de 200 Ar</Label>
              <Input
                type="number"
                name="billet200"
                id="billet200"
                placeholder="0"
                value={billets.billet200}
                onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="billet500">Billet de 500 Ar</Label>
              <Input
                type="number"
                name="billet500"
                id="billet500"
                placeholder="0"
                value={billets.billet500}
                onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="billet1000">Billet de 1000 Ar</Label>
              <Input
                type="number"
                name="billet1000"
                id="billet1000"
                placeholder="0"
                value={billets.billet1000}
                onChange={handleInputChange} />
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <Label for="billet2000">Billet de 2000 Ar</Label>
              <Input
                type="number"
                name="billet2000"
                id="billet2000"
                placeholder="0"
                value={billets.billet2000}
                onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="billet5000">Billet de 5000 Ar</Label>
              <Input
                type="number"
                name="billet5000"
                id="billet5000"
                placeholder="0"
                value={billets.billet5000}
                onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="billet10000">Billet de 10000 Ar</Label>
              <Input
                type="number"
                name="billet10000"
                id="billet10000"
                placeholder="0"
                value={billets.billet10000}
                onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="billet20000">Billet de 20000 Ar</Label>
              <Input
                type="number"
                name="billet20000"
                id="billet20000"
                placeholder="0"
                value={billets.billet20000}
                onChange={handleInputChange} />
            </FormGroup>
            <Button color="primary" onClick={showRecapitulatif} style={{ marginTop: '20px', width: '100%' }}>Calculer</Button>
          </Col>
        </Row>

        {/* Modal pour le récapitulatif des billets */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
          <ModalHeader>Récapitulatif des Billets</ModalHeader>
          <ModalBody>
            {/* Affichez le récapitulatif des billets ici */}
            <ul>
              {Object.entries(billets).map(([billet, quantite]) => (
                <li key={billet}>{quantite} billets de {billet.replace('billet', '')} Ar</li>
              ))}
            </ul>
            {recapitulatif && (
              <li>Total Montant : {recapitulatif.totalMontant} Ar</li>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={handleSubmit}
              style={{ marginTop: '20px', width: '100%' }}
              disabled={isLoadingRequest} // Désactivez le bouton si la requête est en cours
            >
              {isLoadingRequest ? <Spinner size="sm" color="light" /> : 'Valider'}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default Comptage;
