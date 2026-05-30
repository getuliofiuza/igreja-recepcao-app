import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiPhone } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Converte datas do Firestore ({_seconds}) ou strings ISO em objeto Date
const toDate = (v) => {
  if (!v) return null;
  if (typeof v === 'object' && v._seconds != null) return new Date(v._seconds * 1000);
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

function Contatos() {
  const [pessoas, setPessoas] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pessoaId: '',
    tipo: 'WhatsApp',
    descricao: '',
    proximoContato: ''
  });

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      const [pessoasRes, contatosRes] = await Promise.all([
        axios.get(`${API_URL}/pessoas`),
        axios.get(`${API_URL}/contatos/pendentes`)
      ]);
      setPessoas(pessoasRes.data);
      setContatos(contatosRes.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/contatos`, formData);
      buscarDados();
      setFormData({
        pessoaId: '',
        tipo: 'WhatsApp',
        descricao: '',
        proximoContato: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao registrar contato:', error);
      alert('Erro ao registrar contato.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
        <h1><FiPhone /> Log de Contatos</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus /> Novo Contato
        </button>
      </div>

      <div className="card" style={{ marginBottom: '24px', background: '#f8f9ff', borderLeft: '4px solid #667eea' }}>
        <p style={{ color: '#444', lineHeight: 1.6, margin: 0 }}>
          📌 <strong>O que é o Log de Contatos?</strong> É o registro do
          acompanhamento pastoral. Sempre que alguém da equipe entra em contato
          com uma pessoa (WhatsApp, telefone, e-mail ou visita), o contato é
          anotado aqui com a data do próximo retorno. Assim ninguém é esquecido
          e a igreja consegue cuidar de cada pessoa. Abaixo aparecem os contatos
          <strong> pendentes</strong>, já com o <strong>telefone</strong> e o
          <strong> e-mail</strong> de cada pessoa para facilitar o retorno.
        </p>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {showForm && (
            <div className="card" style={{ marginBottom: '30px' }}>
              <h2>Registrar Novo Contato</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Pessoa *</label>
                    <select
                      name="pessoaId"
                      value={formData.pessoaId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Selecione uma pessoa --</option>
                      {pessoas.map((pessoa) => (
                        <option key={pessoa.id} value={pessoa.id}>
                          {pessoa.nomeCompleto}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tipo de Contato</label>
                    <select name="tipo" value={formData.tipo} onChange={handleInputChange}>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Telefone">Telefone</option>
                      <option value="Mensagem">Mensagem</option>
                      <option value="Email">Email</option>
                      <option value="Visita">Visita Pessoal</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Descrição</label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Próximo Contato Previsto</label>
                  <input
                    type="date"
                    name="proximoContato"
                    value={formData.proximoContato}
                    onChange={handleInputChange}
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

          <div className="card">
            <h2>Contatos Pendentes</h2>
            {contatos.length === 0 ? (
              <p style={{ marginTop: '15px', color: '#666' }}>Nenhum contato pendente.</p>
            ) : (
              <div className="table-container" style={{ marginTop: '20px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Pessoa</th>
                      <th>Telefone</th>
                      <th>E-mail</th>
                      <th>Tipo</th>
                      <th>Descrição</th>
                      <th>Próximo Contato</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contatos.map((contato) => {
                      const pessoa = pessoas.find(p => p.id === contato.pessoaId);
                      return (
                        <tr key={contato.id}>
                          <td><strong>{pessoa?.nomeCompleto || 'Desconhecido'}</strong></td>
                          <td>{pessoa?.telefone || '-'}</td>
                          <td>{pessoa?.email || '-'}</td>
                          <td>{contato.tipo}</td>
                          <td>{contato.descricao}</td>
                          <td>{toDate(contato.proximoContato) ? toDate(contato.proximoContato).toLocaleDateString('pt-BR') : '-'}</td>
                          <td>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              backgroundColor: '#fef3c7',
                              color: '#92400e'
                            }}>
                              {contato.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Contatos;
