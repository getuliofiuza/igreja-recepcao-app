import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiBarChart2, FiPhone, FiGift, FiSquare, FiSettings } from 'react-icons/fi';
import Dashboard from './pages/Dashboard';
import Cadastro from './pages/Cadastro';
import CadastroPublico from './pages/CadastroPublico';
import Presencas from './pages/Presencas';
import Relatorios from './pages/Relatorios';
import Contatos from './pages/Contatos';
import Aniversariantes from './pages/Aniversariantes';
import Configuracoes from './pages/Configuracoes';
import QRCodeModal from './components/QRCodeModal';
import './App.css';

// Itens do menu lateral (área administrativa)
const itensMenu = [
  { to: '/', icon: <FiHome />, label: 'Dashboard' },
  { to: '/pessoas', icon: <FiUsers />, label: 'Cadastros' },
  { to: '/presencas', icon: <FiCalendar />, label: 'Presenças' },
  { to: '/relatorios', icon: <FiBarChart2 />, label: 'Relatórios' },
  { to: '/contatos', icon: <FiPhone />, label: 'Contatos' },
  { to: '/aniversariantes', icon: <FiGift />, label: 'Aniversariantes' },
  { to: '/configuracoes', icon: <FiSettings />, label: 'Configurações' }
];

// Área administrativa (com menu lateral). Usada por você e pela equipe da igreja.
function AdminLayout() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const location = useLocation();

  // QR Code aponta para a página pública de cadastro
  const appUrl = process.env.REACT_APP_URL || `${window.location.origin}/cadastro`;

  // Título dinâmico: muda conforme a página atual
  const itemAtual = itensMenu.find((item) => item.to === location.pathname);
  const tituloPagina = itemAtual ? itemAtual.label : 'Recepção';

  const fecharMenu = () => setMenuAberto(false);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <nav className={`sidebar ${menuAberto ? 'open' : ''}`}>
        <div className="logo-section">
          <h1>🏰 Igreja</h1>
          <p>Recepção</p>
        </div>

        <ul className="menu">
          {itensMenu.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="menu-item" onClick={fecharMenu}>
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <p>v1.0.0</p>
        </div>
      </nav>

      {/* Fundo escuro que aparece atrás do menu no celular; fecha o menu ao tocar */}
      {menuAberto && <div className="sidebar-overlay" onClick={fecharMenu} />}

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h2 id="page-title">{tituloPagina}</h2>
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
          <Outlet />
        </div>
      </main>

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        url={appUrl}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Página pública de cadastro — é o que abre ao escanear o QR Code.
            Sem menu lateral e sem lista de pessoas. */}
        <Route path="/cadastro" element={<CadastroPublico />} />

        {/* Área administrativa, com menu lateral */}
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pessoas" element={<Cadastro />} />
          <Route path="/presencas" element={<Presencas />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="/aniversariantes" element={<Aniversariantes />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
