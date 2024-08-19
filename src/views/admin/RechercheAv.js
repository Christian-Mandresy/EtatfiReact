import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { Container, Row, Col, Card, CardHeader, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Spinner } from 'reactstrap';

const RechercheAv = () => {
  const [transactions, setTransactions] = useState({ data: [], current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [types, setTypes] = useState([]);
  const [caisses, setCaisses] = useState([]);
  const [selectedCaisse, setSelectedCaisse] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const [modificationModalOpen, setModificationModalOpen] = useState(false);
  const [suppressionModalOpen, setSuppressionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modifiedTransaction, setModifiedTransaction] = useState({});
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

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
        console.error('Erreur lors de la récupération des caisses :', error);
      }
    };

    fetchCaisses();
  }, []);

  useEffect(() => {
    if (loading) {
      fetchTransactions();
    }
  }, [page, loading]);

  const fetchTransactions = async () => {
    setError(null);

    try {
      await axios.get('/sanctum/csrf-cookie');

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get('/api/transactions/search', {
        headers,
        params: {
          idcaisse: selectedCaisse,
          typetransaction: selectedTypes,
          date_debut: dateDebut,
          date_fin: dateFin,
          page
        }
      });
      setTransactions(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des transactions : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedTypes([...selectedTypes, value]);
    } else {
      setSelectedTypes(selectedTypes.filter((type) => type !== value));
    }
  };

  const handleSearch = () => {
    setPage(1);
    setLoading(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setLoading(true);
  };

  const handleModificationClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModifiedTransaction(transaction);
    setModificationModalOpen(true);
  };

  const handleSuppressionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setSuppressionModalOpen(true);
  };

  const handleModificationModalClose = () => {
    setModificationModalOpen(false);
  };

  const handleSuppressionModalClose = () => {
    setSuppressionModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifiedTransaction({
      ...modifiedTransaction,
      [name]: value,
    });
  };

  const handleModificationSubmit = async () => {
    try {
      setIsLoadingRequest(true);

      await axios.get('/sanctum/csrf-cookie');

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.put(`/api/transactions/${selectedTransaction.id}`, modifiedTransaction, { headers });

      setModificationModalOpen(false);
      fetchTransactions();
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données de modification :', error);
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const handleSuppressionSubmit = async () => {
    try {
      setIsLoadingRequest(true);

      await axios.get('/sanctum/csrf-cookie');

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.delete(`/api/transactions/${selectedTransaction.id}`, { headers });

      setSuppressionModalOpen(false);
      fetchTransactions();
    } catch (error) {
      console.error('Erreur lors de la suppression de la transaction :', error);
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'MGA' });
  };

  const renderPagination = () => {
    if (transactions.last_page <= 1) return null;

    const pages = [];
    const startPage = Math.max(1, transactions.current_page - 2);
    const endPage = Math.min(transactions.last_page, transactions.current_page + 2);

    if (startPage > 1) pages.push(1, '...');
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < transactions.last_page) pages.push('...', transactions.last_page);

    return (
      <nav className="pagination justify-content-end mb-0" aria-label="pagination">
        <ul className="justify-content-end mb-0 pagination">
          <li className={`page-item ${transactions.current_page <= 1 ? 'disabled' : ''}`}>
            <button onClick={() => handlePageChange(transactions.current_page - 1)} className="page-link" disabled={transactions.current_page <= 1}>
              <i className="fas fa-angle-left"></i>
              <span className="sr-only">Previous</span>
            </button>
          </li>
          {pages.map((p, index) => (
            <li key={index} className={`page-item ${p === transactions.current_page ? 'active' : ''}`}>
              {p === '...' ? (
                <span className="page-link">...</span>
              ) : (
                <button onClick={() => handlePageChange(p)} className="page-link">
                  {p} <span className="sr-only">{p === transactions.current_page ? '(current)' : ''}</span>
                </button>
              )}
            </li>
          ))}
          <li className={`page-item ${transactions.current_page >= transactions.last_page ? 'disabled' : ''}`}>
            <button onClick={() => handlePageChange(transactions.current_page + 1)} className="page-link" disabled={transactions.current_page >= transactions.last_page}>
              <i className="fas fa-angle-right"></i>
              <span className="sr-only">Next</span>
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <Container className="mt--7 " fluid>
    <div className="bg-default shadow card">
      <div className="bg-transparent border-0 card-header">
        <h3 className="text-white mb-0">Récapitulatif des Transactions</h3>
        <div className="d-flex justify-content-between mt-3 flex-wrap">
          <div className="form-group mr-2">
            <label className="text-white mr-2">Caisse:</label>
            <select
              value={selectedCaisse}
              onChange={(e) => setSelectedCaisse(e.target.value)}
              className="form-control d-inline-block w-auto"
            >
              <option value="">Toutes</option>
              {caisses.map((caisse) => (
                <option key={caisse.id} value={caisse.id}>
                  {caisse.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mr-2">
            <label className="text-white mr-2">Types de Transactions:</label>
            <div>
              <label>
                <input type="checkbox" value="0" onChange={handleTypeChange} /> Rakitra
              </label>
              <label className="ml-2">
                <input type="checkbox" value="1" onChange={handleTypeChange} /> Dépense
              </label>
              <label className="ml-2">
                <input type="checkbox" value="2" onChange={handleTypeChange} /> Voady
              </label>
              <label className="ml-2">
                <input type="checkbox" value="3" onChange={handleTypeChange} /> Procession
              </label>
            </div>
          </div>
          <div className="form-group mr-2">
            <label className="text-white mr-2">Date Début:</label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="form-control d-inline-block w-auto"
            />
          </div>
          <div className="form-group mr-2">
            <label className="text-white mr-2">Date Fin:</label>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="form-control d-inline-block w-auto"
            />
          </div>
          <button onClick={handleSearch} className="btn btn-primary">Rechercher</button>
        </div>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="align-items-center table-dark table-flush table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Nom Caisse</th>
                <th scope="col">Montant</th>
                <th scope="col">Type</th>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.data.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.caisse.nom}</td>
                  <td>{transaction.montant.toLocaleString('fr-FR')} Ar</td>
                  <td>
                    {transaction.typetransaction === 0 && 'Rakitra'}
                    {transaction.typetransaction === 1 && 'Dépense'}
                    {transaction.typetransaction === 2 && 'Voady'}
                    {transaction.typetransaction === 3 && 'Procession'}
                  </td>
                  <td>{format(parseISO(transaction.datetransaction), 'dd/MM/yyyy')}</td>
                  <td>{transaction.description}</td>
                  <td>
                    <Button color="primary" onClick={() => handleModificationClick(transaction)}>
                      Modifier
                    </Button>
                    <Button color="danger" onClick={() => handleSuppressionClick(transaction)}>
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination()}
        </div>
      )}

      {/* Modal de modification */}
      <Modal isOpen={modificationModalOpen} toggle={handleModificationModalClose}>
        <ModalHeader toggle={handleModificationModalClose}>Modification Transaction</ModalHeader>
        <ModalBody>
          {selectedTransaction && (
            <>
              <FormGroup>
                <Label for="montant">Montant</Label>
                <Input
                  type="number"
                  name="montant"
                  id="montant"
                  placeholder="Montant"
                  value={modifiedTransaction.montant || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Description"
                  value={modifiedTransaction.description || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="idcaisse">Caisse</Label>
                <Input
                  type="select"
                  name="idcaisse"
                  id="idcaisse"
                  value={modifiedTransaction.idcaisse || ''}
                  onChange={handleInputChange}
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
                  name="typetransaction"
                  id="typetransaction"
                  value={modifiedTransaction.typetransaction || ''}
                  onChange={handleInputChange}
                >
                  <option value="0">Rakitra</option>
                  <option value="1">Dépense</option>
                  <option value="2">Voady</option>
                  <option value="3">Procession</option>
                </Input>
              </FormGroup>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleModificationSubmit} disabled={isLoadingRequest}>
            {isLoadingRequest ? <Spinner size="sm" color="light" /> : 'Valider'}
          </Button>
          <Button color="secondary" onClick={handleModificationModalClose}>
            Annuler
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal de suppression */}
      <Modal isOpen={suppressionModalOpen} toggle={handleSuppressionModalClose}>
        <ModalHeader toggle={handleSuppressionModalClose}>Suppression Transaction</ModalHeader>
        <ModalBody>
          {selectedTransaction && (
            <p>Voulez-vous vraiment supprimer cette transaction ?</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleSuppressionSubmit} disabled={isLoadingRequest}>
            {isLoadingRequest ? <Spinner size="sm" color="light" /> : 'Oui'}
          </Button>
          <Button color="secondary" onClick={handleSuppressionModalClose}>
            Non
          </Button>
        </ModalFooter>
      </Modal>
    </div>
    </Container>
  );
};

export default RechercheAv;
