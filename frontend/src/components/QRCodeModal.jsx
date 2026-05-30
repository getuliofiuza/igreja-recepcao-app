import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { FiDownload, FiX } from 'react-icons/fi';

function QRCodeModal({ isOpen, onClose, url }) {
  const qrRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      type: 'svg',
      data: url,
      image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" font-size="50" text-anchor="middle" dy=".3em" fill="%23667eea">♰</text></svg>',
      dotsOptions: {
        color: '#000000',
        type: 'rounded'
      },
      cornersSquareOptions: {
        color: '#667eea',
        type: 'extra-rounded'
      },
      cornersDotOptions: {
        color: '#667eea',
        type: 'dot'
      },
      backgroundOptions: {
        color: '#ffffff'
      },
      margin: 10
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }
  }, [isOpen, url]);

  const downloadQR = () => {
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      type: 'png',
      data: url,
      dotsOptions: {
        color: '#000000',
        type: 'rounded'
      },
      cornersSquareOptions: {
        color: '#667eea',
        type: 'extra-rounded'
      },
      cornersDotOptions: {
        color: '#667eea',
        type: 'dot'
      },
      backgroundOptions: {
        color: '#ffffff'
      },
      margin: 10
    });

    qrCode.download({
      name: 'qr-code-recepcao-igreja',
      extension: 'png'
    });
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        maxWidth: '500px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>📱 QR Code da Recepção</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            <FiX />
          </button>
        </div>

        <p style={{ color: '#666', marginBottom: '30px' }}>
          Escaneie este QR code para acessar o sistema de recepção
        </p>

        <div
          ref={qrRef}
          style={{
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            marginBottom: '30px',
            display: 'inline-block'
          }}
        />

        <p style={{ fontSize: '12px', color: '#999', marginBottom: '20px' }}>
          URL: <strong>{url}</strong>
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={downloadQR}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FiDownload /> Baixar QR Code
          </button>
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRCodeModal;
