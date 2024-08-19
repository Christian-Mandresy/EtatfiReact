import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
import axios from 'axios';
import Header from "components/Headers/SaisieHeader.js";

const AjoutVoady = () => {
  const [montant, setMontant] = useState('');
  const [caisses, setCaisses] = useState([]);
  const [selectedCaisse, setSelectedCaisse] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCaisses = async () => {
      try {
        await axios.get('/sanctum/csrf-cookie');

        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('/api/caisses', { headers });
        setCaisses(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des caisses :', error);
      }
    };

    fetchCaisses();
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      await axios.get('/sanctum/csrf-cookie');

        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };

      // Préparez les données pour l'envoi
      const formData = {
        montant: parseInt(montant),
        caisse: selectedCaisse ? parseInt(selectedCaisse) : null,
        description: description,
      };

      console.log(selectedCaisse);

      // Envoyez la requête à l'API
      const response = await axios.post('/api/transactions/ajout-voady', formData,{ headers });

      console.log(response.data);

      // Réinitialisez les champs après l'ajout réussi
      setMontant('');
      setSelectedCaisse('');
      setDescription('');

      // Arrêtez le chargement
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du voady :', error);

      // Arrêtez le chargement en cas d'erreur
      setIsLoading(false);
    }
  };

  return (
    <>
    <Header />
    <Container className="mt--7" fluid>
      <Row>
        <Col>
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Ajout de Voady</h3>
            </CardHeader>
            <CardBody>
              <Form>
                <FormGroup>
                  <Label for="montant">Montant</Label>
                  <Input
                    type="number"
                    id="montant"
                    placeholder="Montant"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="caisse">Caisse</Label>
                  <Input
                    type="select"
                    id="caisse"
                    value={selectedCaisse}
                    onChange={(e) => setSelectedCaisse(e.target.value)}
                  >
                    <option value="">Sélectionnez une caisse</option>
                    {caisses.map((caisse) => (
                      <option key={caisse.id} value={caisse.id}>
                        {caisse.nom}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="text"
                    id="description"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormGroup>
                <Button color="primary" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" color="light" /> : 'Ajouter Voady'}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default AjoutVoady;
