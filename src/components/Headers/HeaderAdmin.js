import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Container, Row, Col, Spinner } from "reactstrap";
import axios from 'axios';

const HeaderAdmin = () => {
  const [caisses, setCaisses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError('Erreur lors de la récupération des caisses : ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCaisses();
  }, []);

  return (
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          {/* Card stats */}
          <Row>
            {loading ? (
              <Col>
                <Spinner color="light" />
              </Col>
            ) : error ? (
              <Col>
                <div className="text-danger">{error}</div>
              </Col>
            ) : (
              caisses.map((caisse) => (
                <Col lg="12" xl="5" key={caisse.id}>
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            <p>{caisse.nom}</p>
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {caisse.solde.toLocaleString('fr-FR')} Ar
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                            <i className="fas fa-wallet" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default HeaderAdmin;
