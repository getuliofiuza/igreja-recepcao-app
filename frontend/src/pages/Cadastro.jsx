import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Cadastro() {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    sexo: '',
    estadoCivil: '',
    telefone: '',
    email: '',
    bairro: '',
    tipoPessoa: 'Visitante',
    batizado: false,
    ministerio: '',
    observacoes: ''
  });

  useEffect(() => {
    buscarPessoas();
  }, []);

  const buscarPessoas = async () => {
    try {
      const response = await axios.get(`${API_URL}/pessoas`);
      setPessoas(response.data);
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API_URL}/pessoas/${editId}`, formData);
      } else {
        await axios.post(`${API_URL}/pessoas`, formData);
      }

      buscarPessoas();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar pessoa:', error);
      alert('Erro ao salvar a pessoa. Tente novamente.');
    }
  };

  const handleEditar = (pessoa) => {
    setFormData(pessoa);
    setEditId(pessoa.id);
    setShowForm(true);
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta pessoa?')) {
      try {
        await axios.delete(`${API_URL}/pessoas/${id}`);
        buscarPessoas();
      } catch (error) {
        console.error('Erro ao deletar pessoa:', error);
        alert('Erro ao deletar a pessoa.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nomeCompleto: '',
      dataNascimento: '',
      sexo: '',
      estadoCivil: '',
      telefone: '',
      email: '',
      bairro: '',
      tipoPessoa: 'Visitante',
      batizado: false,
      ministerio: '',
      observacoes: ''
    });
    setEditId(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>👥 Cadastro de Pessoas</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus /> Cadastre aqui
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h2>{editId ? 'Editar' : 'Novo'} Cadastro</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Sexo</label>
                <select name="sexo" value={formData.sexo} onChange={handleInputChange}>
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estado Civil</label>
                <select name="estadoCivil" value={formData.estadoCivil} onChange={handleInputChange}>
                  <option value="">Selecione</option>
                  <option value="Solteiro(a)">Solteiro(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Viúvo(a)">Viúvo(a)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bairro</label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Tipo de Pessoa</label>
                <select name="tipoPessoa" value={formData.tipoPessoa} onChange={handleInputChange}>
                  <option value="Visitante">Visitante</option>
                  <option value="Membro">Membro</option>
                  <option value="Líder">Líder</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ministério</label>
                <input
                  type="text"
                  name="ministerio"
                  value={formData.ministerio}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label>Batizado</label>
                <input
                  type="checkbox"
                  name="batizado"
                  checked={formData.batizado}
                  onChange={handleInputChange}
                  style={{ width: 'auto', marginTop: '10px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Observações</label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                Salvar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Carregando cadastros...</p>
      ) : (
        <div className="card">
          <h2>Total: {pessoas.length} pessoas</h2>
          {pessoas.length === 0 ? (
            <p style={{ marginTop: '15px', color: '#666' }}>Nenhuma pessoa cadastrada. Clique em "Cadastre aqui" para começar!</p>
          ) : (
            <div className="table-container" style={{ marginTop: '20px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Tipo</th>
                    <th>Bairro</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pessoas.map((pessoa) => (
                    <tr key={pessoa.id}>
                      <td><strong>{pessoa.nomeCompleto}</strong></td>
                      <td>{pessoa.telefone || '-'}</td>
                      <td>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          backgroundColor: pessoa.tipoPessoa === 'Visitante' ? '#fef3c7' : '#dbeafe',
                          color: pessoa.tipoPessoa === 'Visitante' ? '#92400e' : '#1e40af'
                        }}>
                          {pessoa.tipoPessoa}
                        </span>
                      </td>
                      <td>{pessoa.bairro || '-'}</td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEditar(pessoa)}
                          style={{ marginRight: '5px', padding: '6px 12px' }}
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeletar(pessoa.id)}
                          style={{ padding: '6px 12px' }}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Cadastro;
