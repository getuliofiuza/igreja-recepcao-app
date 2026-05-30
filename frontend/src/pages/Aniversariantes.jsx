import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiGift } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Aniversariantes() {
  const [aniversariantes, setAniversariantes] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarAniversariantes(mesSelecionado);
  }, [mesSelecionado]);

  const buscarAniversariantes = async (mes) => {
    try {
      const response = await axios.get(`${API_URL}/aniversariantes/mes/${mes}`);
      setAniversariantes(response.data);
    } catch (error) {
      console.error('Erro ao buscar aniversariantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNasc = nascimento.getMonth();

    if (mesAtual < mesNasc || (mesAtual === mesNasc && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade;
  };

  return (
    <div>
      <h1><FiGift /> Aniversariantes</h1>

      <div className="card" style={{ marginBottom: '20px' }}>
        <label htmlFor="select-mes">Selecione o mês:</label>
        <select
          id="select-mes"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(parseInt(e.target.value))}
          style={{ marginTop: '10px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }}
        >
          {meses.map((mes, index) => (
            <option key={index} value={index + 1}>
              {mes}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Carregando aniversariantes...</p>
      ) : (
        <div className="card">
          <h2>Aniversariantes de {meses[mesSelecionado - 1]}</h2>
          {aniversariantes.length === 0 ? (
            <p style={{ marginTop: '15px', color: '#666' }}>Nenhum aniversariante neste mês.</p>
          ) : (
            <>
              <p style={{ marginTop: '10px', marginBottom: '20px', color: '#666' }}>
                Total: <strong>{aniversariantes.length}</strong> aniversariante(s)
              </p>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Data de Nascimento</th>
                      <th>Idade Atual</th>
                      <th>Telefone</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aniversariantes.map((pessoa) => (
                      <tr key={pessoa.id}>
                        <td><strong>{pessoa.nomeCompleto}</strong></td>
                        <td>{new Date(pessoa.dataNascimento).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            backgroundColor: '#fce7f3',
                            color: '#831843'
                          }}>
                            {calcularIdade(pessoa.dataNascimento)} anos
                          </span>
                        </td>
                        <td>{pessoa.telefone || '-'}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              if (pessoa.telefone) {
                                window.open(`https://wa.me/55${pessoa.telefone.replace(/\D/g, '')}?text=Feliz%20Aniversário%20${encodeURIComponent(pessoa.nomeCompleto)}!`);
                              } else {
                                alert('Telefone não cadastrado.');
                              }
                            }}
                            style={{ padding: '6px 12px' }}
                          >
                            Enviar Mensagem
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Aniversariantes;
