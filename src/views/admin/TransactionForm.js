import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
import axios from 'axios';

const TransactionForm = () => {
  const [montant, setMontant] = useState('');
  const [caisses, setCaisses] = useState([]);
  const [selectedCaisse, setSelectedCaisse] = useState('');
  const [description, setDescription] = useState('');
  const [typetransaction, setTypetransaction] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      await axios.get('/sanctum/csrf-cookie');

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const formData = {
        montant: parseInt(montant),
        idcaisse: selectedCaisse ? parseInt(selectedCaisse) : null,
        description,
        typetransaction: parseInt(typetransaction)
      };

      const response = await axios.post('/api/transactions', formData, { headers });

      console.log(response.data);

      // Réinitialiser le formulaire après l'ajout réussi
      setMontant('');
      setSelectedCaisse('');
      setDescription('');
      setTypetransaction('');

      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la transaction :', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Ajout de Transaction</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="montant">Montant</Label>
                    <Input
                      type="number"
                      id="montant"
                      placeholder="Montant"
                      value={montant}
                      onChange={(e) => setMontant(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="caisse">Caisse</Label>
                    <Input
                      type="select"
                      id="caisse"
                      value={selectedCaisse}
                      onChange={(e) => setSelectedCaisse(e.target.value)}
                      required
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
                    <Label for="typetransaction">Type de Transaction</Label>
                    <Input
                      type="select"
                      id="typetransaction"
                      value={typetransaction}
                      onChange={(e) => setTypetransaction(e.target.value)}
                      required
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="0">Rakitra</option>
                      <option value="1">Dépense</option>
                      <option value="2">Voady</option>
                      <option value="3">Procession</option>
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
                  <Button color="primary" type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner size="sm" color="light" /> : 'Ajouter Transaction'}
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

export default TransactionForm;
