import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiBarChart2, FiPhone, FiGift, FiList, FiSquare, FiSettings } from 'react-icons/fi';
import Dashboard from './pages/Dashboard';
import Cadastro from './pages/Cadastro';
import Presencas from './pages/Presencas';
import Visitantes from './pages/Visitantes';
import Contatos from './pages/Contatos';
import Aniversariantes from './pages/Aniversariantes';
import Configuracoes from './pages/Configuracoes';
import QRCodeModal from './components/QRCodeModal';
import './App.css';

function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const appUrl = process.env.REACT_APP_URL || window.location.origin;

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <nav className="sidebar">
          <div className="logo-section">
            <h1>🏰 Igreja</h1>
            <p>Recepção</p>
          </div>

          <ul className="menu">
            <li>
              <Link to="/" className="menu-item">
                <FiHome /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/cadastro" className="menu-item">
                <FiUsers /> Cadastro
              </Link>
            </li>
            <li>
              <Link to="/presencas" className="menu-item">
                <FiCalendar /> Presenças
              </Link>
            </li>
            <li>
              <Link to="/visitantes" className="menu-item">
                <FiBarChart2 /> Visitantes
              </Link>
            </li>
            <li>
              <Link to="/contatos" className="menu-item">
                <FiPhone /> Contatos
              </Link>
            </li>
            <li>
              <Link to="/aniversariantes" className="menu-item">
                <FiGift /> Aniversariantes
              </Link>
            </li>
            <li>
              <Link to="/listas" className="menu-item">
                <FiList /> Listas
              </Link>
            </li>
            <li>
              <Link to="/configuracoes" className="menu-item">
                <FiSettings /> Configurações
              </Link>
            </li>
          </ul>

          <div className="sidebar-footer">
            <p>v1.0.0</p>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <header className="header">
            <h2 id="page-title">Dashboard</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowQRModal(true)}
                style={{ padding: '8px 16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FiSquare /> QR Code
              </button>
              <button className="btn-menu" onClick={() => setMenuAberto(!menuAberto)}>
                ☰
              </button>
            </div>
          </header>

          <div className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/presencas" element={<Presencas />} />
              <Route path="/visitantes" element={<Visitantes />} />
              <Route path="/contatos" element={<Contatos />} />
              <Route path="/aniversariantes" element={<Aniversariantes />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Routes>
          </div>
        </main>

        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          url={appUrl}
        />
      </div>
    </Router>
  );
}

export default App;
