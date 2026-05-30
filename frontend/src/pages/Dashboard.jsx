import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiUserCheck, FiUserPlus, FiCalendar } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalPessoas: 0,
    membros: 0,
    visitantes: 0,
    presencasHoje: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarEstatisticas();
  }, []);

  const buscarEstatisticas = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>📊 Dashboard</h1>

      {loading ? (
        <p>Carregando estatísticas...</p>
      ) : (
        <>
          <div className="card-grid">
            <div className="stat-card">
              <FiUsers size={32} style={{ color: '#667eea' }} />
              <div className="stat-number">{stats.totalPessoas}</div>
              <div className="stat-label">Total de Pessoas</div>
            </div>

            <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
              <FiUserCheck size={32} style={{ color: '#10b981' }} />
              <div className="stat-number" style={{ color: '#10b981' }}>{stats.membros}</div>
              <div className="stat-label">Membros</div>
            </div>

            <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
              <FiUserPlus size={32} style={{ color: '#f59e0b' }} />
              <div className="stat-number" style={{ color: '#f59e0b' }}>{stats.visitantes}</div>
              <div className="stat-label">Visitantes</div>
            </div>

            <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
              <FiCalendar size={32} style={{ color: '#8b5cf6' }} />
              <div className="stat-number" style={{ color: '#8b5cf6' }}>{stats.presencasHoje}</div>
              <div className="stat-label">Presentes Hoje</div>
            </div>
          </div>

          <div className="card">
            <h2>📈 Resumo Executivo</h2>
            <p style={{ marginTop: '15px', lineHeight: '1.6' }}>
              Seu sistema de recepção está funcionando! Você tem <strong>{stats.totalPessoas}</strong> pessoas cadastradas,
              sendo <strong>{stats.membros}</strong> membros da congregação e <strong>{stats.visitantes}</strong> visitantes.
            </p>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
              <h3>💡 Dicas</h3>
              <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
                <li>Use a seção "Cadastro" para registrar novas pessoas</li>
                <li>Marque presenças para acompanhar a frequência</li>
                <li>Converta visitantes em membros quando apropriado</li>
                <li>Acompanhe contatos pendentes regularmente</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
