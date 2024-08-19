import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EditEmployer = () => {
    const { id } = useParams();
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [salaire, setSalaire] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployer(id);
    }, [id]);

    const fetchEmployer = async (id) => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`/api/employers/${id}`, { headers });
            const employer = response.data;
            setNom(employer.nom);
            setPrenom(employer.prenom);
            setSalaire(employer.salaire);
        } catch (error) {
            setMessage('Error fetching employer details');
            console.error('Error fetching employer details', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.get('/sanctum/csrf-cookie');
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.put(`/api/employers/${id}`, { nom, prenom, salaire }, { headers });
            setMessage('Employer updated successfully');
            navigate('/employers');
        } catch (error) {
            setMessage(error.response.data.error || 'Error updating employer');
        }
    };

    return (
        <div className="shadow card">
            <div className="border-0 card-header">
                <h3 className="mb-0">Edit Employer</h3>
            </div>
            <div className="card-body">
                {message && <Alert color="danger">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="nom">Name</Label>
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
                        <Label for="prenom">Surname</Label>
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
                        <Label for="salaire">Salary</Label>
                        <Input
                            type="number"
                            name="salaire"
                            id="salaire"
                            value={salaire}
                            onChange={(e) => setSalaire(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <Button color="primary" type="submit">Update Employer</Button>
                </Form>
            </div>
        </div>
    );
};

export default EditEmployer;
