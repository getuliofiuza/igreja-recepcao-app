const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar Firebase
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();

// ==================== ROUTES CADASTRO ====================
// GET - Listar todas as pessoas
app.get('/api/pessoas', async (req, res) => {
  try {
    const snapshot = await db.collection('pessoas').get();
    const pessoas = [];
    snapshot.forEach(doc => {
      pessoas.push({ id: doc.id, ...doc.data() });
    });
    res.json(pessoas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar nova pessoa
app.post('/api/pessoas', async (req, res) => {
  try {
    const { nomeCompleto, dataNascimento, sexo, telefone, email, ...restoDados } = req.body;

    const novaPessoa = {
      nomeCompleto,
      dataNascimento,
      sexo,
      telefone,
      email,
      dataCadastro: new Date(),
      ...restoDados
    };

    const docRef = await db.collection('pessoas').add(novaPessoa);
    res.json({ id: docRef.id, ...novaPessoa });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar pessoa
app.put('/api/pessoas/:id', async (req, res) => {
  try {
    await db.collection('pessoas').doc(req.params.id).update(req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Deletar pessoa
app.delete('/api/pessoas/:id', async (req, res) => {
  try {
    await db.collection('pessoas').doc(req.params.id).delete();
    res.json({ message: 'Pessoa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROUTES PRESENÇAS ====================
// GET - Presenças de uma pessoa
app.get('/api/presencas/:pessoaId', async (req, res) => {
  try {
    const snapshot = await db.collection('presencas')
      .where('pessoaId', '==', req.params.pessoaId)
      .orderBy('data', 'desc')
      .get();

    const presencas = [];
    snapshot.forEach(doc => {
      presencas.push({ id: doc.id, ...doc.data() });
    });
    res.json(presencas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Registrar presença
app.post('/api/presencas', async (req, res) => {
  try {
    const { pessoaId, data, evento, observacoes } = req.body;

    const novaPresenca = {
      pessoaId,
      data: new Date(data),
      evento,
      observacoes,
      criadoEm: new Date()
    };

    const docRef = await db.collection('presencas').add(novaPresenca);
    res.json({ id: docRef.id, ...novaPresenca });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Registrar presença de várias pessoas de uma só vez (lote)
app.post('/api/presencas/lote', async (req, res) => {
  try {
    const { pessoaIds, data, evento, observacoes } = req.body;

    if (!Array.isArray(pessoaIds) || pessoaIds.length === 0) {
      return res.status(400).json({ error: 'Selecione ao menos uma pessoa.' });
    }

    const dataPresenca = new Date(data);
    const batch = db.batch();

    pessoaIds.forEach((pessoaId) => {
      const ref = db.collection('presencas').doc();
      batch.set(ref, {
        pessoaId,
        data: dataPresenca,
        evento: evento || 'Culto',
        observacoes: observacoes || '',
        criadoEm: new Date()
      });
    });

    await batch.commit();
    res.json({ message: 'Presenças registradas com sucesso', total: pessoaIds.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Listar TODAS as presenças (usado nos relatórios)
app.get('/api/presencas', async (req, res) => {
  try {
    const snapshot = await db.collection('presencas').get();
    const presencas = [];
    snapshot.forEach((doc) => {
      presencas.push({ id: doc.id, ...doc.data() });
    });
    res.json(presencas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROUTES VISITANTES ====================
// POST - Converter visitante em membro
app.post('/api/visitantes/:pessoaId/converter', async (req, res) => {
  try {
    await db.collection('pessoas').doc(req.params.pessoaId).update({
      tipoPessoa: 'Membro',
      dataConversao: new Date(),
      statusIntegracao: 'Convertido'
    });
    res.json({ message: 'Visitante convertido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROUTES DASHBOARD ====================
// GET - Estatísticas gerais
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const totalPessoas = (await db.collection('pessoas').get()).size;
    const membros = (await db.collection('pessoas')
      .where('tipoPessoa', '==', 'Membro').get()).size;
    const visitantes = (await db.collection('pessoas')
      .where('tipoPessoa', '==', 'Visitante').get()).size;

    const hoje = new Date().toISOString().split('T')[0];
    const presencasHoje = (await db.collection('presencas')
      .where('data', '>=', new Date(hoje))
      .where('data', '<', new Date(new Date(hoje).getTime() + 86400000))
      .get()).size;

    res.json({
      totalPessoas,
      membros,
      visitantes,
      presencasHoje
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROUTES CONTATOS ====================
// POST - Registrar contato
app.post('/api/contatos', async (req, res) => {
  try {
    const { pessoaId, tipo, descricao, proximoContato } = req.body;

    const novoContato = {
      pessoaId,
      tipo,
      descricao,
      proximoContato: proximoContato ? new Date(proximoContato) : null,
      data: new Date(),
      status: 'Pendente'
    };

    const docRef = await db.collection('contatos').add(novoContato);
    res.json({ id: docRef.id, ...novoContato });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Contatos pendentes
app.get('/api/contatos/pendentes', async (req, res) => {
  try {
    const snapshot = await db.collection('contatos')
      .where('status', '==', 'Pendente')
      .orderBy('proximoContato', 'asc')
      .get();

    const contatos = [];
    snapshot.forEach(doc => {
      contatos.push({ id: doc.id, ...doc.data() });
    });
    res.json(contatos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROUTES ANIVERSARIANTES ====================
// GET - Aniversariantes do mês
app.get('/api/aniversariantes/mes/:mes', async (req, res) => {
  try {
    const snapshot = await db.collection('pessoas').get();
    const aniversariantes = [];

    snapshot.forEach(doc => {
      const pessoa = doc.data();
      if (pessoa.dataNascimento) {
        const mesNasc = new Date(pessoa.dataNascimento).getMonth() + 1;
        if (mesNasc === parseInt(req.params.mes)) {
          aniversariantes.push({ id: doc.id, ...pessoa });
        }
      }
    });

    aniversariantes.sort((a, b) => {
      const diaA = new Date(a.dataNascimento).getDate();
      const diaB = new Date(b.dataNascimento).getDate();
      return diaA - diaB;
    });

    res.json(aniversariantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
