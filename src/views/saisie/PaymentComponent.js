import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import 'assets/css/PaymentComponent.css';

const PaymentComponent = () => {
  const [employers, setEmployers] = useState([]);
  const [selectedEmployer, setSelectedEmployer] = useState('');
  const [amount, setAmount] = useState('');
  const [totalPaid, setTotalPaid] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
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
        console.error('Error fetching employers:', error);
      }
    };

    fetchEmployers();
  }, []);

  useEffect(() => {
    if (selectedEmployer) {
      fetchPayments();
    }
  }, [selectedEmployer]);

  const fetchPayments = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie');
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`/api/employer/${selectedEmployer}/payments`, { headers });
      setTotalPaid(response.data.totalPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setMessage('');

    try {
      await axios.get('/sanctum/csrf-cookie');
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(`/api/employer/${selectedEmployer}/payment`, {
        amount: parseFloat(amount),
      }, { headers });

      setMessage(response.data.message);
      fetchPayments();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-component">
      <h3>Employer Payment</h3>
      <Form>
        <FormGroup>
          <Label for="employerSelect">Select Employer:</Label>
          <Input
            type="select"
            name="select"
            id="employerSelect"
            value={selectedEmployer}
            onChange={(e) => setSelectedEmployer(e.target.value)}
          >
            <option value="">Select</option>
            {employers.map((employer) => (
              <option key={employer.id} value={employer.id}>
                {employer.nom} {employer.prenom}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="amount">Amount:</Label>
          <Input
            type="number"
            name="amount"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </FormGroup>
        <Button color="primary" onClick={handlePayment} disabled={loading}>
          {loading ? 'Processing...' : 'Submit Payment'}
        </Button>
      </Form>
      {message && (
        <Alert color={message.includes('Error') ? 'danger' : 'success'} className="mt-3">
          {message}
        </Alert>
      )}
      <div className="mt-3">
        <h4>Total Paid for Current Month: {totalPaid}</h4>
      </div>
    </div>
  );
};

export default PaymentComponent;
