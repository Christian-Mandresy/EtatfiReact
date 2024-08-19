import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

const PaymentsList = () => {
    const [payments, setPayments] = useState([]);
    const [totalPayments, setTotalPayments] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [newAmount, setNewAmount] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get('/api/paymentsToday', { headers });
            setPayments(response.data.payments);
            setTotalPayments(response.data.totalPayments);
        } catch (error) {
            console.error('Error fetching payments', error);
        }
    };

    const toggleModal = (payment) => {
        setSelectedPayment(payment);
        setNewAmount(payment ? payment.montant : '');
        setModal(!modal);
    };

    const toggleDeleteModal = (payment) => {
        setSelectedPayment(payment);
        setDeleteModal(!deleteModal);
    };

    const handleUpdatePayment = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.put(`/api/payments/${selectedPayment.transaction_id}`, { amount: newAmount }, { headers });
            setMessage('Payment updated successfully');
            toggleModal(null);
            fetchPayments();
        } catch (error) {
            setMessage(error.response.data.error || 'Error updating payment');
            toggleModal(null);
        }
    };

    const handleDeletePayment = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.delete(`/api/payments/${selectedPayment.transaction_id}`, { headers });
            setMessage('Payment deleted successfully');
            toggleDeleteModal(null);
            fetchPayments();
        } catch (error) {
            setMessage(error.response.data.error || 'Error deleting payment');
            toggleDeleteModal(null);
        }
    };

    return (
        <div>
            <h2>Payments List</h2>
            {message && <Alert color="danger">{message}</Alert>}
            <Table>
                <thead>
                    <tr>
                        <th>Employer</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Salary Month</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.transaction_id}>
                            <td>{`${payment.nom} ${payment.prenom}`}</td>
                            <td>{payment.montant}</td>
                            <td>{new Date(payment.datetransaction).toLocaleDateString()}</td>
                            <td>{new Date(payment.mois_cumul).toLocaleDateString('default', { month: 'long', year: 'numeric' })}</td>
                            <td>
                                <Button color="warning" onClick={() => toggleModal(payment)}>Edit</Button>
                                <Button color="danger" onClick={() => toggleDeleteModal(payment)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <p>Total Payments: {totalPayments}</p>

            <Modal isOpen={modal} toggle={() => toggleModal(null)}>
                <ModalHeader toggle={() => toggleModal(null)}>Edit Payment</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="amount">New Amount</Label>
                            <Input
                                type="number"
                                name="amount"
                                id="amount"
                                value={newAmount}
                                onChange={(e) => setNewAmount(e.target.value)}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleUpdatePayment}>Save</Button>
                    <Button color="secondary" onClick={() => toggleModal(null)}>Cancel</Button>
                </ModalFooter>
                </Modal>
                <Modal isOpen={deleteModal} toggle={() => toggleDeleteModal(null)}>
            <ModalHeader toggle={() => toggleDeleteModal(null)}>Delete Payment</ModalHeader>
            <ModalBody>
                Are you sure you want to delete this payment?
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={handleDeletePayment}>Delete</Button>
                <Button color="secondary" onClick={() => toggleDeleteModal(null)}>Cancel</Button>
            </ModalFooter>
        </Modal>
    </div>
    );
};

export default PaymentsList;
