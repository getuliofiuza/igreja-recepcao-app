import React, { useState } from 'react';
import { FiList } from 'react-icons/fi';

function Listas() {
  return (
    <div>
      <h1><FiList /> Listas Úteis</h1>

      <div className="card-grid">
        <div className="card">
          <h3>📋 Membros Batizados</h3>
          <p>Relatório de todos os membros batizados da congregação.</p>
          <button className="btn btn-primary" style={{ marginTop: '15px' }}>
            Ver Lista
          </button>
        </div>

        <div className="card">
          <h3>🎯 Líderes de Célula</h3>
          <p>Contatos de todos os líderes de célula e seus grupos.</p>
          <button className="btn btn-primary" style={{ marginTop: '15px' }}>
            Ver Lista
          </button>
        </div>

        <div className="card">
          <h3>🔔 Visitantes Frequentes</h3>
          <p>Visitantes que aparecem regularmente nos cultos.</p>
          <button className="btn btn-primary" style={{ marginTop: '15px' }}>
            Ver Lista
          </button>
        </div>

        <div className="card">
          <h3>📞 Contatos de Emergência</h3>
          <p>Lista de contatos prioritários para comunicações importantes.</p>
          <button className="btn btn-primary" style={{ marginTop: '15px' }}>
            Ver Lista
          </button>
        </div>
      </div>

      <div className="card">
        <h2>📊 Exportar Dados</h2>
        <p style={{ marginTop: '15px', marginBottom: '20px' }}>
          Exporte os dados em diferentes formatos para relatórios e análises.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary">📥 Exportar como CSV</button>
          <button className="btn btn-secondary">📥 Exportar como Excel</button>
          <button className="btn btn-secondary">📥 Exportar como PDF</button>
        </div>
      </div>
    </div>
  );
}

export default Listas;
