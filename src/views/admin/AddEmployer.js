import React, { useState } from 'react';
import axios from 'axios';
import { Form, FormGroup, Label, Input, Button, Alert, Container, Row, Col, Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const AddEmployer = () => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [salaire, setSalaire] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.get('/sanctum/csrf-cookie');
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.post('/api/employers', { nom, prenom, salaire }, { headers });
            setMessage('Employer added successfully');
            navigate('/admin/employers');
        } catch (error) {
            setMessage(error.response.data.error || 'Error adding employer');
        }
    };

    return (
        <Container className="mt--7" fluid>
            <Row className="justify-content-center">
                <Col md="8" lg="6">
                    <Card className="shadow">
                        <CardHeader className="border-0">
                            <h3 className="mb-0">Ajout Employer</h3>
                        </CardHeader>
                        <CardBody>
                            {message && <Alert color="danger">{message}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label for="nom">Nom</Label>
                                    <Input
                                        type="text"
                                        name="nom"
                                        id="nom"
                                        value={nom}
                                        onChange={(e) => setNom(e.target.value)}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="prenom">Prenom</Label>
                                    <Input
                                        type="text"
                                        name="prenom"
                                        id="prenom"
                                        value={prenom}
                                        onChange={(e) => setPrenom(e.target.value)}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="salaire">Salaire</Label>
                                    <Input
                                        type="number"
                                        name="salaire"
                                        id="salaire"
                                        value={salaire}
                                        onChange={(e) => setSalaire(e.target.value)}
                                        required
                                    />
                                </FormGroup>
                                <Button color="primary" type="submit" block>Ajouter Employer</Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddEmployer;
