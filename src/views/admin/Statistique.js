import React, { useState, useEffect } from 'react';



import { FormGroup, Label, Input, Button, Row ,Col } from 'reactstrap';
import axios from 'axios';
import { Table } from 'reactstrap';



const Statistique = () => {
    const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assurez-vous d'obtenir le CSRF cookie
        await axios.get('/sanctum/csrf-cookie');

        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('/api/monthly-balance-by-caisse', { headers });
        setData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données statistiques :', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Statistiques par Caisse</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Année</th>
            <th>Mois</th>
            <th>Caisse ID</th>
            <th>Argent Reçu</th>
            <th>Argent Dépensé</th>
            <th>Solde Restant</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={`${item.annee}-${item.mois}-${item.id}`}>
              <td>{item.annee}</td>
              <td>{item.mois}</td>
              <td>{item.id}</td>
              <td>{item.argent_recu}</td>
              <td>{item.argent_depense}</td>
              <td>{item.solde_restant}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Statistique;
