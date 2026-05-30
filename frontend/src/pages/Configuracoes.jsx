import React, { useState } from 'react';
import { FiSettings, FiSquare, FiCloud } from 'react-icons/fi';
import QRCodeModal from '../components/QRCodeModal';

function Configuracoes() {
  const [showQRModal, setShowQRModal] = useState(false);
  const [urlPublica, setUrlPublica] = useState(localStorage.getItem('urlPublica') || 'http://localhost:3000');

  const handleSaveUrl = () => {
    localStorage.setItem('urlPublica', urlPublica);
    alert('URL pública salva com sucesso!');
  };

  return (
    <div>
      <h1><FiSettings /> Configurações</h1>

      <div className="card-grid">
        <div className="card">
          <h3>📱 QR Code</h3>
          <p>Gere um QR code para as pessoas acessarem o sistema de recepção facilmente.</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowQRModal(true)}
            style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
          >
            <FiSquare /> Gerar QR Code
          </button>
        </div>

        <div className="card">
          <h3>☁️ Armazenamento em Nuvem</h3>
          <p>Todos os dados são automaticamente salvos no Firebase. Seus dados estão seguros na nuvem.</p>
          <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
            <p style={{ margin: '0', fontSize: '13px', color: '#1e40af' }}>
              ✓ Firestore Database<br />
              ✓ Backup automático<br />
              ✓ Acesso 24/7<br />
              ✓ Sincronização em tempo real
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>🌐 URL Pública</h2>
        <p style={{ marginTop: '10px', marginBottom: '20px', color: '#666' }}>
          Configure a URL pública do seu app para que o QR code aponte para o endereço correto.
        </p>

        <div className="form-group">
          <label>URL da Aplicação</label>
          <input
            type="text"
            value={urlPublica}
            onChange={(e) => setUrlPublica(e.target.value)}
            placeholder="Ex: https://seu-dominio.com"
          />
          <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
            Use a URL que as pessoas vão acessar. <br />
            <strong>Padrão em desenvolvimento:</strong> http://localhost:3000
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSaveUrl}>
          Salvar URL
        </button>
      </div>

      <div className="card">
        <h2>📚 Informações do Sistema</h2>
        <table style={{ marginTop: '15px' }}>
          <tbody>
            <tr>
              <td><strong>Versão:</strong></td>
              <td>1.0.0</td>
            </tr>
            <tr>
              <td><strong>Banco de Dados:</strong></td>
              <td>Firebase Firestore</td>
            </tr>
            <tr>
              <td><strong>URL Atual:</strong></td>
              <td style={{ wordBreak: 'break-all' }}>{window.location.origin}</td>
            </tr>
            <tr>
              <td><strong>URL do QR Code:</strong></td>
              <td style={{ wordBreak: 'break-all' }}>{urlPublica}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>🔧 Backup e Dados</h2>
        <p style={{ marginTop: '10px', marginBottom: '20px', color: '#666' }}>
          Seu banco de dados está armazenado no Firebase. Você pode gerenciar seus dados através do Firebase Console.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={() => window.open('https://console.firebase.google.com', '_blank')}
          >
            Acessar Firebase Console
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              const data = JSON.stringify({ backup: 'true', date: new Date() }, null, 2);
              const link = document.createElement('a');
              link.href = 'data:text/json,' + encodeURIComponent(data);
              link.download = 'config-backup.json';
              link.click();
            }}
          >
            Fazer Backup de Configurações
          </button>
        </div>
      </div>

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        url={urlPublica}
      />
    </div>
  );
}

export default Configuracoes;
