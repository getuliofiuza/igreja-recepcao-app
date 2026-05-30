import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const formInicial = {
  nomeCompleto: '',
  dataNascimento: '',
  sexo: '',
  estadoCivil: '',
  telefone: '',
  email: '',
  cep: '',
  cidade: '',
  bairro: '',
  tipoPessoa: 'Visitante',
  batizado: false,
  ministerio: '',
  observacoes: ''
};

function CadastroPublico() {
  const [formData, setFormData] = useState(formInicial);
  const [salvando, setSalvando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Busca o endereço automaticamente pelo CEP (API pública ViaCEP)
  const buscarCep = async (cepValor) => {
    const cepLimpo = (cepValor || '').replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dados = await resp.json();
      if (!dados.erro) {
        setFormData((prev) => ({
          ...prev,
          cidade: dados.localidade || prev.cidade,
          bairro: dados.bairro || prev.bairro
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await axios.post(`${API_URL}/pessoas`, formData);
      setEnviado(true);
    } catch (error) {
      console.error('Erro ao salvar cadastro:', error);
      alert('Não foi possível enviar seu cadastro. Por favor, tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const novoCadastro = () => {
    setFormData(formInicial);
    setEnviado(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '640px' }}>
        {/* Boas-vindas */}
        <div style={{ textAlign: 'center', color: '#ffffff', marginBottom: '28px' }}>
          <div style={{ fontSize: '52px' }}>🏰</div>
          <h1 style={{ fontSize: '30px', margin: '12px 0 8px', lineHeight: 1.25 }}>
            SEJA BEM-VINDO AO NOSSO VIVA
          </h1>
          <p style={{ opacity: 0.9, fontSize: '16px' }}>
            Faça seu cadastro abaixo. É rapidinho! 😊
          </p>
        </div>

        {enviado ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ fontSize: '60px' }}>🎉</div>
            <h2 style={{ margin: '16px 0 10px' }}>Cadastro concluído!</h2>
            <p style={{ color: '#666', marginBottom: '28px', lineHeight: 1.5 }}>
              Seja muito bem-vindo à nossa igreja. Que Deus abençoe sua vida e
              sua família. 🙏
            </p>
            <button className="btn btn-primary" onClick={novoCadastro}>
              Fazer outro cadastro
            </button>
          </div>
        ) : (
          <div className="card">
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
                  <label>CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    onBlur={(e) => buscarCep(e.target.value)}
                    placeholder="00000-000 (preenche cidade automático)"
                  />
                </div>
                <div className="form-group">
                  <label>Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
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
                  <label>Você já é membro ou visitante?</label>
                  <select name="tipoPessoa" value={formData.tipoPessoa} onChange={handleInputChange}>
                    <option value="Visitante">Visitante</option>
                    <option value="Membro">Membro</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Observações</label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Algo que queira nos contar? (opcional)"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={salvando}
                style={{ width: '100%', marginTop: '8px' }}
              >
                {salvando ? 'Enviando...' : 'Enviar cadastro'}
              </button>
            </form>
          </div>
        )}

        <p style={{ textAlign: 'center', color: '#ffffff', opacity: 0.7, marginTop: '20px', fontSize: '13px' }}>
          Seus dados são tratados com cuidado e usados apenas pela igreja. 💜
        </p>
      </div>
    </div>
  );
}

export default CadastroPublico;
