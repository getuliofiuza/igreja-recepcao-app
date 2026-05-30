import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBarChart2, FiUsers, FiAward, FiUserCheck } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Converte datas do Firestore ({_seconds}) ou strings ISO em objeto Date
const toDate = (v) => {
  if (!v) return null;
  if (typeof v === 'object' && v._seconds != null) return new Date(v._seconds * 1000);
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

const hojeISO = () => new Date().toISOString().split('T')[0];
const diasAtras = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

function Relatorios() {
  const [pessoas, setPessoas] = useState([]);
  const [presencas, setPresencas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aba, setAba] = useState('resumo'); // resumo | presencas | visitantes | batizados

  // Período do relatório
  const [inicio, setInicio] = useState(diasAtras(30));
  const [fim, setFim] = useState(hojeISO());
  const [agrupamento, setAgrupamento] = useState('dia'); // dia | semana | mes

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resPessoas, resPresencas] = await Promise.all([
        axios.get(`${API_URL}/pessoas`),
        axios.get(`${API_URL}/presencas`)
      ]);
      setPessoas(resPessoas.data);
      setPresencas(resPresencas.data);
    } catch (error) {
      console.error('Erro ao carregar dados dos relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Limites do período (inclusivo)
  const inicioDate = new Date(inicio + 'T00:00:00');
  const fimDate = new Date(fim + 'T23:59:59');

  const dentroDoPeriodo = (data) => {
    const d = toDate(data);
    return d && d >= inicioDate && d <= fimDate;
  };

  // Presenças dentro do período
  const presencasPeriodo = presencas.filter((p) => dentroDoPeriodo(p.data));

  const membros = pessoas.filter((p) => p.tipoPessoa === 'Membro' || p.tipoPessoa === 'Líder');
  const visitantes = pessoas.filter((p) => p.tipoPessoa === 'Visitante');
  const batizados = pessoas.filter((p) => p.batizado === true);

  // ---- Relatório de presença de membros ----
  const nomePorId = {};
  pessoas.forEach((p) => { nomePorId[p.id] = p.nomeCompleto; });

  const presencasPorPessoa = {};
  presencasPeriodo.forEach((p) => {
    if (!presencasPorPessoa[p.pessoaId]) {
      presencasPorPessoa[p.pessoaId] = { total: 0, ultima: null };
    }
    presencasPorPessoa[p.pessoaId].total += 1;
    const d = toDate(p.data);
    if (d && (!presencasPorPessoa[p.pessoaId].ultima || d > presencasPorPessoa[p.pessoaId].ultima)) {
      presencasPorPessoa[p.pessoaId].ultima = d;
    }
  });

  const relatorioMembros = membros
    .map((m) => ({
      id: m.id,
      nome: m.nomeCompleto,
      total: presencasPorPessoa[m.id]?.total || 0,
      ultima: presencasPorPessoa[m.id]?.ultima || null
    }))
    .sort((a, b) => b.total - a.total);

  // ---- Relatório de visitantes por dia/semana/mês ----
  // Agrupa as PRESENÇAS de visitantes no período pela data
  const idsVisitantes = new Set(visitantes.map((v) => v.id));
  const presencasVisitantes = presencasPeriodo.filter((p) => idsVisitantes.has(p.pessoaId));

  const chaveAgrupamento = (date) => {
    if (agrupamento === 'mes') {
      return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
    if (agrupamento === 'semana') {
      // início da semana (domingo)
      const d = new Date(date);
      d.setDate(d.getDate() - d.getDay());
      return `Semana de ${d.toLocaleDateString('pt-BR')}`;
    }
    return date.toLocaleDateString('pt-BR');
  };

  const visitantesAgrupados = {};
  presencasVisitantes.forEach((p) => {
    const d = toDate(p.data);
    if (!d) return;
    const chave = chaveAgrupamento(d);
    visitantesAgrupados[chave] = (visitantesAgrupados[chave] || 0) + 1;
  });
  const linhasVisitantes = Object.entries(visitantesAgrupados);

  if (loading) {
    return (
      <div>
        <h1><FiBarChart2 /> Relatórios</h1>
        <p style={{ marginTop: '20px' }}>Carregando dados...</p>
      </div>
    );
  }

  const abaBtn = (id, label) => (
    <button
      onClick={() => setAba(id)}
      className={`btn ${aba === id ? 'btn-primary' : 'btn-secondary'}`}
      style={{ padding: '8px 16px' }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1><FiBarChart2 /> Relatórios</h1>
        <p style={{ color: '#666', marginTop: '6px' }}>
          Acompanhe a presença dos membros, os visitantes por período e o total
          de batizados.
        </p>
      </div>

      {/* Filtro de período */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>De</label>
            <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Até</label>
            <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
          <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => { setInicio(hojeISO()); setFim(hojeISO()); }}>Hoje</button>
          <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => { setInicio(diasAtras(7)); setFim(hojeISO()); }}>Últimos 7 dias</button>
          <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => { setInicio(diasAtras(30)); setFim(hojeISO()); }}>Últimos 30 dias</button>
          <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => { setInicio(diasAtras(365)); setFim(hojeISO()); }}>Último ano</button>
        </div>
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {abaBtn('resumo', '📊 Resumo')}
        {abaBtn('presencas', '✅ Presença de Membros')}
        {abaBtn('visitantes', '🔔 Visitantes por Período')}
        {abaBtn('batizados', '💧 Membros Batizados')}
      </div>

      {/* RESUMO */}
      {aba === 'resumo' && (
        <div className="card-grid">
          <div className="stat-card">
            <FiUsers size={28} style={{ color: '#667eea' }} />
            <div className="stat-number">{membros.length}</div>
            <div className="stat-label">Membros</div>
          </div>
          <div className="stat-card">
            <FiUserCheck size={28} style={{ color: '#667eea' }} />
            <div className="stat-number">{visitantes.length}</div>
            <div className="stat-label">Visitantes</div>
          </div>
          <div className="stat-card">
            <FiAward size={28} style={{ color: '#667eea' }} />
            <div className="stat-number">{batizados.length}</div>
            <div className="stat-label">Batizados</div>
          </div>
          <div className="stat-card">
            <FiBarChart2 size={28} style={{ color: '#667eea' }} />
            <div className="stat-number">{presencasPeriodo.length}</div>
            <div className="stat-label">Presenças no período</div>
          </div>
        </div>
      )}

      {/* PRESENÇA DE MEMBROS */}
      {aba === 'presencas' && (
        <div className="card">
          <h2>Presença de membros no período</h2>
          <p style={{ color: '#666', margin: '6px 0 16px' }}>
            {new Date(inicio + 'T00:00:00').toLocaleDateString('pt-BR')} até {new Date(fim + 'T00:00:00').toLocaleDateString('pt-BR')}
          </p>
          {relatorioMembros.length === 0 ? (
            <p style={{ color: '#666' }}>Nenhum membro cadastrado.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Membro</th>
                    <th>Presenças</th>
                    <th>Última presença</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorioMembros.map((m) => (
                    <tr key={m.id}>
                      <td><strong>{m.nome}</strong></td>
                      <td>{m.total}</td>
                      <td>{m.ultima ? m.ultima.toLocaleDateString('pt-BR') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VISITANTES POR PERÍODO */}
      {aba === 'visitantes' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h2>Visitantes por período</h2>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['dia', 'semana', 'mes'].map((g) => (
                <button
                  key={g}
                  onClick={() => setAgrupamento(g)}
                  className={`btn ${agrupamento === g ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '6px 12px', textTransform: 'capitalize' }}
                >
                  {g === 'mes' ? 'Mês' : g}
                </button>
              ))}
            </div>
          </div>
          <p style={{ color: '#666', margin: '6px 0 16px' }}>
            Presenças de visitantes agrupadas por {agrupamento === 'mes' ? 'mês' : agrupamento}.
          </p>
          {linhasVisitantes.length === 0 ? (
            <p style={{ color: '#666' }}>Nenhuma presença de visitante no período.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Período</th>
                    <th>Visitantes presentes</th>
                  </tr>
                </thead>
                <tbody>
                  {linhasVisitantes.map(([periodo, total]) => (
                    <tr key={periodo}>
                      <td><strong>{periodo}</strong></td>
                      <td>{total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MEMBROS BATIZADOS */}
      {aba === 'batizados' && (
        <div className="card">
          <h2>Membros batizados — total: {batizados.length}</h2>
          {batizados.length === 0 ? (
            <p style={{ color: '#666', marginTop: '10px' }}>Nenhum membro batizado registrado.</p>
          ) : (
            <div className="table-container" style={{ marginTop: '16px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Cidade</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {batizados.map((p) => (
                    <tr key={p.id}>
                      <td><strong>{p.nomeCompleto}</strong></td>
                      <td>{p.telefone || '—'}</td>
                      <td>{p.cidade || '—'}</td>
                      <td>{p.tipoPessoa}</td>
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

export default Relatorios;
