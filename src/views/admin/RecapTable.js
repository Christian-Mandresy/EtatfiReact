import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO, isValid, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Container } from 'reactstrap';

const RecapTable = () => {
  const [recapData, setRecapData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState('2023');
  const [recapType, setRecapType] = useState('monthly'); // 'monthly' or 'weekly'
  const [caisses, setCaisses] = useState([]);
  const [selectedCaisse, setSelectedCaisse] = useState('');
  const [page, setPage] = useState(1);

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
        if (response.data.length > 0) {
          setSelectedCaisse(response.data[0].id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des caisses :', error);
      }
    };

    fetchCaisses();
  }, []);

  useEffect(() => {
    if (selectedCaisse) {
      fetchRecapData();
    }
  }, [year, recapType, selectedCaisse, page]);

  const fetchRecapData = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.get('/sanctum/csrf-cookie');

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const endpoint = recapType === 'monthly' ? `/api/recap-monthly/${year}` : `/api/recap-weekly/${year}`;
      const response = await axios.get(endpoint, {
        headers,
        params: {
          idcaisse: selectedCaisse,
          page
        }
      });
      setRecapData(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      setError('Erreur lors de la récupération des données récapitulatives : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString, type) => {
    if (!dateString) {
      return 'Date invalide';
    }
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return 'Date invalide';
    }
    return type === 'monthly'
      ? format(date, 'MMMM yyyy', { locale: fr })
      : `semaine du ${format(startOfWeek(date, { locale: fr }), 'dd MMMM yyyy', { locale: fr })}`;
  };

  const formatAmount = (amount) => {
    return `${amount.toLocaleString('fr-FR')} Ar`;
  };

  const generateKey = (data, type) => {
    const dateKey = data[type === 'monthly' ? 'month' : 'week'] || `${type}-${Math.random()}`;
    return `${data.idcaisse}-${dateKey}`;
  };

  const totalPages = Math.ceil(total / 5);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container className="mt--7" fluid>
    <div className="bg-default shadow card">
      <div className="bg-transparent border-0 card-header">
        <h3 className="text-white mb-0">Récapitulatif {recapType === 'monthly' ? 'Mensuel' : 'Hebdomadaire'}</h3>
        <div className="d-flex justify-content-between mt-3 flex-wrap">
          <div className="form-group mr-2">
            <label className="text-white mr-2">Année:</label>
            <input 
              type="number" 
              value={year} 
              onChange={(e) => setYear(e.target.value)} 
              min="2000" 
              max="2100" 
              className="form-control d-inline-block w-auto"
            />
          </div>
          <div className="form-group mr-2">
            <label className="text-white mr-2">Caisse:</label>
            <select
              value={selectedCaisse}
              onChange={(e) => setSelectedCaisse(e.target.value)}
              className="form-control d-inline-block w-auto"
            >
              {caisses.map((caisse) => (
                <option key={caisse.id} value={caisse.id}>
                  {caisse.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="btn-group">
            <button className={`btn btn-${recapType === 'monthly' ? 'primary' : 'secondary'}`} onClick={() => setRecapType('monthly')}>Récap Mensuel</button>
            <button className={`btn btn-${recapType === 'weekly' ? 'primary' : 'secondary'}`} onClick={() => setRecapType('weekly')}>Récap Hebdomadaire</button>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="align-items-center table-dark table-flush table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">{recapType === 'monthly' ? 'Mois' : 'Semaine'}</th>
              <th scope="col">Entrée</th>
              <th scope="col">Dépense</th>
              <th scope="col">Solde</th>
            </tr>
          </thead>
          <tbody>
            {recapData.map((data) => (
              <tr key={generateKey(data, recapType)}>
                <td>{formatDate(data[recapType === 'monthly' ? 'month' : 'week'], recapType)}</td>
                <td>{formatAmount(data.entree)}</td>
                <td>{formatAmount(data.depense)}</td>
                <td>{formatAmount(data.solde)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav className="pagination justify-content-end mb-0" aria-label="pagination">
          <ul className="justify-content-end mb-0 pagination">
            <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
              <a href="#" onClick={() => setPage(page > 1 ? page - 1 : 1)} className="page-link">
                <i className="fas fa-angle-left"></i>
                <span className="sr-only">Previous</span>
              </a>
            </li>
            {[...Array(totalPages).keys()].map((p) => (
              <li key={p} className={`page-item ${p + 1 === page ? 'active' : ''}`}>
                <a href="#" onClick={() => setPage(p + 1)} className="page-link">
                  {p + 1} <span className="sr-only">{p + 1 === page ? '(current)' : ''}</span>
                </a>
              </li>
            ))}
            <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
              <a href="#" onClick={() => setPage(page + 1)} className="page-link">
                <i className="fas fa-angle-right"></i>
                <span className="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    </Container>
  );
};

export default RecapTable;
