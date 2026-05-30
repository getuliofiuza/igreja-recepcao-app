import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheckSquare, FiCalendar, FiSearch } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Presencas() {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [busca, setBusca] = useState('');
  const [selecionados, setSelecionados] = useState([]); // ids das pessoas marcadas
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    evento: 'Culto',
    observacoes: ''
  });

  // Histórico individual
  const [pessoaHistorico, setPessoaHistorico] = useState('');
  const [presencas, setPresencas] = useState([]);

  useEffect(() => {
    buscarPessoas();
  }, []);

  useEffect(() => {
    if (pessoaHistorico) {
      buscarPresencas(pessoaHistorico);
    } else {
      setPresencas([]);
    }
  }, [pessoaHistorico]);

  const buscarPessoas = async () => {
    try {
      const response = await axios.get(`${API_URL}/pessoas`);
      const ordenadas = [...response.data].sort((a, b) =>
        (a.nomeCompleto || '').localeCompare(b.nomeCompleto || '')
      );
      setPessoas(ordenadas);
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

  const toggleSelecionado = (id) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Lista filtrada pela busca
  const pessoasFiltradas = pessoas.filter((p) =>
    (p.nomeCompleto || '').toLowerCase().includes(busca.toLowerCase())
  );

  const todosFiltradosMarcados =
    pessoasFiltradas.length > 0 &&
    pessoasFiltradas.every((p) => selecionados.includes(p.id));

  const toggleTodos = () => {
    if (todosFiltradosMarcados) {
      // desmarca os filtrados
      const idsFiltrados = pessoasFiltradas.map((p) => p.id);
      setSelecionados((prev) => prev.filter((id) => !idsFiltrados.includes(id)));
    } else {
      // marca todos os filtrados (sem duplicar)
      const idsFiltrados = pessoasFiltradas.map((p) => p.id);
      setSelecionados((prev) => Array.from(new Set([...prev, ...idsFiltrados])));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selecionados.length === 0) {
      alert('Selecione ao menos uma pessoa para marcar presença.');
      return;
    }
    setSalvando(true);
    try {
      const resp = await axios.post(`${API_URL}/presencas/lote`, {
        pessoaIds: selecionados,
        data: formData.data,
        evento: formData.evento,
        observacoes: formData.observacoes
      });
      alert(`Presença registrada para ${resp.data.total} pessoa(s)! 🎉`);
      setSelecionados([]);
      setFormData({
        data: new Date().toISOString().split('T')[0],
        evento: 'Culto',
        observacoes: ''
      });
      // Atualiza histórico se estiver vendo alguém
      if (pessoaHistorico) buscarPresencas(pessoaHistorico);
    } catch (error) {
      console.error('Erro ao registrar presenças:', error);
      alert('Erro ao registrar as presenças. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1><FiCalendar /> Registro de Presenças</h1>
        <p style={{ color: '#666', marginTop: '6px' }}>
          Marque a presença de vários membros de uma só vez. Selecione as
          pessoas, escolha o evento e clique em salvar.
        </p>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {/* Dados do evento */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h2>Dados do evento</h2>
            <div className="form-row" style={{ marginTop: '16px' }}>
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
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Observações (opcional)</label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                rows="2"
              />
            </div>
          </div>

          {/* Seleção de pessoas */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h2>Selecione as pessoas</h2>
              <span style={{
                background: '#dbeafe',
                color: '#1e40af',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600
              }}>
                {selecionados.length} selecionada(s)
              </span>
            </div>

            {/* Busca */}
            <div className="form-group" style={{ marginTop: '16px', position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '14px', color: '#999' }} />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar pessoa pelo nome..."
                style={{ paddingLeft: '36px' }}
              />
            </div>

            {pessoasFiltradas.length === 0 ? (
              <p style={{ color: '#666' }}>Nenhuma pessoa encontrada.</p>
            ) : (
              <>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '2px solid #e5e7eb', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={todosFiltradosMarcados}
                    onChange={toggleTodos}
                    style={{ width: 'auto' }}
                  />
                  Selecionar todos ({pessoasFiltradas.length})
                </label>
                <div style={{ maxHeight: '340px', overflowY: 'auto', marginTop: '4px' }}>
                  {pessoasFiltradas.map((pessoa) => (
                    <label
                      key={pessoa.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 0',
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selecionados.includes(pessoa.id)}
                        onChange={() => toggleSelecionado(pessoa.id)}
                        style={{ width: 'auto' }}
                      />
                      <span style={{ flex: 1 }}>{pessoa.nomeCompleto}</span>
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 10px',
                        borderRadius: '20px',
                        backgroundColor: pessoa.tipoPessoa === 'Visitante' ? '#fef3c7' : '#dbeafe',
                        color: pessoa.tipoPessoa === 'Visitante' ? '#92400e' : '#1e40af'
                      }}>
                        {pessoa.tipoPessoa}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}

            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={salvando || selecionados.length === 0}
              style={{ marginTop: '20px', width: '100%' }}
            >
              <FiCheckSquare />
              {salvando
                ? 'Salvando...'
                : `Marcar presença (${selecionados.length})`}
            </button>
          </div>

          {/* Histórico individual */}
          <div className="card">
            <h2>Histórico de presenças</h2>
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label htmlFor="select-historico">Ver histórico de:</label>
              <select
                id="select-historico"
                value={pessoaHistorico}
                onChange={(e) => setPessoaHistorico(e.target.value)}
              >
                <option value="">-- Escolha uma pessoa --</option>
                {pessoas.map((pessoa) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nomeCompleto}
                  </option>
                ))}
              </select>
            </div>

            {pessoaHistorico && (
              presencas.length === 0 ? (
                <p style={{ color: '#666' }}>Nenhuma presença registrada para esta pessoa.</p>
              ) : (
                <div className="table-container" style={{ marginTop: '10px' }}>
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
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Presencas;
