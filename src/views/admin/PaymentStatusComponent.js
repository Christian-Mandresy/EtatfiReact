import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, FormGroup, Label, Input, Alert, Container } from 'reactstrap';
import 'assets/css/PaymentStatusComponent.css';

const PaymentStatusComponent = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [paymentStatus, setPaymentStatus] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPaymentStatus(year);
    }, [year]);

    const fetchPaymentStatus = async (year) => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`/api/payment-status/${year}`, { headers });
            setPaymentStatus(response.data);
        } catch (error) {
            setMessage('Error fetching payment status');
            console.error('Error fetching payment status', error);
        }
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('default', { month: 'long' });
    };

    return (
        <>
        <Container className="mt--7" fluid>
        <div className='row'>
            <div className='col'>
                <div className="shadow card">
                <div className="border-0 card-header">
                    <h3 className="mb-0">Statut de payement pour l'annee {year}</h3>
                </div>
                <div className="table-responsive">
                    {message && <Alert color="danger">{message}</Alert>}
                    <Form inline className="mb-3">
                        <FormGroup>
                            <Label for="year" className="mr-2">Annee</Label>
                            <Input
                                type="number"
                                name="year"
                                id="year"
                                value={year}
                                onChange={handleYearChange}
                                min="2000"
                                max={new Date().getFullYear()}
                            />
                        </FormGroup>
                    </Form>
                    <Table className="align-items-center table-flush">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Nom</th>
                                <th scope="col">Prenom</th>
                                <th scope="col">Salaire</th>
                                <th scope="col">Total payé</th>
                                <th scope="col">Reste</th>
                                <th scope="col">Annee</th>
                                <th scope="col">Mois</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentStatus.map((status) => (
                                <tr key={`${status.id}-${status.mois}`}>
                                    <td>{status.nom}</td>
                                    <td>{status.prenom}</td>
                                    <td>{status.salaire}</td>
                                    <td>{status.total}</td>
                                    <td>{status.reste}</td>
                                    <td>{status.annee}</td>
                                    <td>{getMonthName(status.mois)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                
                </div>
            </div>
        </div>
        </Container>
        </>
    );
};

export default PaymentStatusComponent;
