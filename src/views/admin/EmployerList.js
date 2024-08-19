import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert, Container } from 'reactstrap';
import { Link } from 'react-router-dom';

const EmployerList = () => {
    const [employers, setEmployers] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [salaire, setSalaire] = useState('');

    useEffect(() => {
        fetchEmployers();
    }, []);

    const fetchEmployers = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get('/api/employers', { headers });
            setEmployers(response.data);
        } catch (error) {
            console.error('Error fetching employers', error);
        }
    };

    const toggleDeleteModal = (employer) => {
        setSelectedEmployer(employer);
        setDeleteModal(!deleteModal);
    };

    const toggleEditModal = (employer) => {
        setSelectedEmployer(employer);
        if (employer) {
            setNom(employer.nom);
            setPrenom(employer.prenom);
            setSalaire(employer.salaire);
        }
        setEditModal(!editModal);
    };

    const handleDeleteEmployer = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.delete(`/api/employers/${selectedEmployer.id}`, { headers });
            setMessage('Employer deleted successfully');
            toggleDeleteModal(null);
            fetchEmployers();
        } catch (error) {
            setMessage(error.response.data.error || 'Error deleting employer');
        }
    };

    const handleEditEmployer = async (e) => {
        e.preventDefault();

        try {
            await axios.get('/sanctum/csrf-cookie');
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.put(`/api/employers/${selectedEmployer.id}`, { nom, prenom, salaire }, { headers });
            setMessage('Employer updated successfully');
            toggleEditModal(null);
            fetchEmployers();
        } catch (error) {
            setMessage(error.response.data.error || 'Error updating employer');
        }
    };

    return (
        <Container className="mt--7" fluid>
        <div className="shadow card">
            <div className="border-0 card-header d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Employers</h3>
                <Link to="/add-employer" className="btn btn-primary btn-sm">Add Employer</Link>
            </div>
            <div className="table-responsive">
                {message && <Alert color="danger">{message}</Alert>}
                <Table className="align-items-center table-flush">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Nom</th>
                            <th scope="col">Prenom</th>
                            <th scope="col">Salaire</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employers.map((employer) => (
                            <tr key={employer.id}>
                                <td>{employer.nom}</td>
                                <td>{employer.prenom}</td>
                                <td>{employer.salaire}</td>
                                <td>
                                    <Button color="warning" size="sm" onClick={() => toggleEditModal(employer)}>Modifier</Button>
                                    <Button color="danger" size="sm" onClick={() => toggleDeleteModal(employer)}>Supprimer</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal isOpen={deleteModal} toggle={() => toggleDeleteModal(null)}>
                <ModalHeader toggle={() => toggleDeleteModal(null)}>Delete Employer</ModalHeader>
                <ModalBody>
                    Etes vous sure de supprimer cet employer?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDeleteEmployer}>Supprimer</Button>
                    <Button color="secondary" onClick={() => toggleDeleteModal(null)}>Annuler</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={editModal} toggle={() => toggleEditModal(null)}>
                <ModalHeader toggle={() => toggleEditModal(null)}>Modifier Employer</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleEditEmployer}>
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
                        <Button color="primary" type="submit">Modifier Employer</Button>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => toggleEditModal(null)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
        </Container>
    );
};

export default EmployerList;
