import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiCalendar } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Presencas() {
  const [pessoas, setPessoas] = useState([]);
  const [presencas, setPresencas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState('');
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    evento: 'Culto',
    observacoes: ''
  });

  useEffect(() => {
    buscarPessoas();
  }, []);

  useEffect(() => {
    if (selectedPessoa) {
      buscarPresencas(selectedPessoa);
    }
  }, [selectedPessoa]);

  const buscarPessoas = async () => {
    try {
      const response = await axios.get(`${API_URL}/pessoas`);
      setPessoas(response.data);
      if (response.data.length > 0) {
        setSelectedPessoa(response.data[0].id);
      }
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscarPresencas = async (pessoaId) => {
    try {
      const response = await axios.get(`${API_URL}/presencas/${pessoaId}`);
      setPresencas(response.data);
    } catch (error) {
      console.error('Erro ao buscar presenças:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/presencas`, {
        pessoaId: selectedPessoa,
        ...formData
      });
      buscarPresencas(selectedPessoa);
      setFormData({
        data: new Date().toISOString().split('T')[0],
        evento: 'Culto',
        observacoes: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao registrar presença:', error);
      alert('Erro ao registrar presença.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1><FiCalendar /> Registro de Presenças</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus /> Registrar Presença
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="card" style={{ marginBottom: '20px' }}>
            <label htmlFor="select-pessoa">Selecione uma pessoa:</label>
            <select
              id="select-pessoa"
              value={selectedPessoa}
              onChange={(e) => setSelectedPessoa(e.target.value)}
              style={{ marginTop: '10px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }}
            >
              <option value="">-- Escolha uma pessoa --</option>
              {pessoas.map((pessoa) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nomeCompleto}
                </option>
              ))}
            </select>
          </div>

          {showForm && (
            <div className="card" style={{ marginBottom: '30px' }}>
              <h2>Registrar Presença</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Data</label>
                    <input
                      type="date"
                      name="data"
                      value={formData.data}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Evento</label>
                    <select name="evento" value={formData.evento} onChange={handleInputChange}>
                      <option value="Culto">Culto</option>
                      <option value="Célula">Célula</option>
                      <option value="Seminário">Seminário</option>
                      <option value="Assembleia">Assembleia</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Observações</label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary">
                    Salvar
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {selectedPessoa && (
            <div className="card">
              <h2>Histórico de Presenças</h2>
              {presencas.length === 0 ? (
                <p style={{ marginTop: '15px', color: '#666' }}>Nenhuma presença registrada para esta pessoa.</p>
              ) : (
                <div className="table-container" style={{ marginTop: '20px' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Evento</th>
                        <th>Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {presencas.map((presenca) => (
                        <tr key={presenca.id}>
                          <td>{new Date(presenca.data).toLocaleDateString('pt-BR')}</td>
                          <td>{presenca.evento}</td>
                          <td>{presenca.observacoes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Presencas;
