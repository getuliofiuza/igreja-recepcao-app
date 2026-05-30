# 🏗️ Arquitetura do Sistema

## Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                    Navegador (Frontend)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │         React Application (Port 3000)             │   │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────┐  │   │
│  │  │  Dashboard │  │   Cadastro  │  │Presenças │  │   │
│  │  └────────────┘  └─────────────┘  └──────────┘  │   │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────┐  │   │
│  │  │ Visitantes │  │  Contatos   │  │Aniversário│ │   │
│  │  └────────────┘  └─────────────┘  └──────────┘  │   │
│  └──────────────────────────────────────────────────┘   │
│              ↓ (HTTP/REST API Calls) ↓                   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Express.js Backend (Port 5000)              │
│  ┌──────────────────────────────────────────────────┐   │
│  │         API Routes & Controllers                  │   │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────┐  │   │
│  │  │  /pessoas  │  │ /presencas  │  │/visitantes│ │   │
│  │  └────────────┘  └─────────────┘  └──────────┘  │   │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────┐  │   │
│  │  │ /contatos  │  │/aniversariantes│/dashboard│  │   │
│  │  └────────────┘  └─────────────┘  └──────────┘  │   │
│  └──────────────────────────────────────────────────┘   │
│              ↓ (Firestore Queries) ↓                     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                   Firebase / Firestore                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Collections:                                    │   │
│  │  • pessoas      (cadastro de pessoas)            │   │
│  │  • presencas    (frequências)                    │   │
│  │  • contatos     (follow-up)                      │   │
│  │  • acompanhamento (desenvolvimento)              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Stack Tecnológico

### Frontend
- **React 18.2** - Interface de usuário
- **React Router** - Navegação entre páginas
- **Axios** - Requisições HTTP
- **React Icons** - Ícones
- **CSS3** - Estilização (sem frameworks pesados)

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Firebase Admin SDK** - Conexão com Firestore
- **CORS** - Requisições cross-origin
- **Dotenv** - Variáveis de ambiente

### Banco de Dados
- **Firebase Firestore** - NoSQL em nuvem
- **Autenticação Firebase** - (opcional para futuro)

## Estrutura de Dados

### Collection: pessoas
```
├── ID (Auto)
├── nomeCompleto (string)
├── dataNascimento (timestamp)
├── idade (number - calculado)
├── sexo (string)
├── estadoCivil (string)
├── telefone (string)
├── email (string)
├── bairro (string)
├── dataPrimeiraVisita (timestamp)
├── tipoPessoa (string: "Visitante" | "Membro" | "Líder")
├── batizado (boolean)
├── ministerio (string)
├── liderResponsavel (string)
├── observacoes (string)
├── consentimentoLGPD (boolean)
├── origemCadastro (string)
├── canalPreferencial (string)
├── dataCadastro (timestamp)
├── dataAtualizacao (timestamp)
├── celula (string)
└── statusIntegracao (string)
```

### Collection: presencas
```
├── ID (Auto)
├── pessoaId (reference)
├── data (timestamp)
├── evento (string)
├── observacoes (string)
└── criadoEm (timestamp)
```

### Collection: contatos
```
├── ID (Auto)
├── pessoaId (reference)
├── tipo (string: "WhatsApp" | "Telefone" | "Email" | "Visita")
├── descricao (string)
├── proximoContato (timestamp)
├── data (timestamp)
└── status (string: "Pendente" | "Concluído")
```

## Fluxos Principais

### 1. Cadastrar Nova Pessoa
```
[Frontend Form] → POST /api/pessoas → [Backend] → Firestore → Sucesso ✓
```

### 2. Registrar Presença
```
[Select Pessoa] → POST /api/presencas → [Backend] → Firestore → Lista Atualizada ✓
```

### 3. Converter Visitante em Membro
```
[Botão Converter] → POST /api/visitantes/{id}/converter → [Backend] → Firestore → Tipo = Membro ✓
```

### 4. Buscar Aniversariantes
```
[Select Mês] → GET /api/aniversariantes/mes/{mes} → [Backend] → Filtra → Lista ✓
```

## Segurança

### Frontend
- Validação de formulários
- HTTPS em produção
- Nenhum segredo armazenado localmente

### Backend
- Variáveis de ambiente para credenciais
- CORS configurado
- Validação de entrada (express-validator)
- Firebase Admin SDK para operações seguras

### Firestore
- Regras de segurança (em desenvolvimento)
- Acesso apenas via Backend em produção
- Backups automáticos

## Performance

### Frontend
- Code splitting com React Router
- CSS otimizado
- Imagens minimizadas

### Backend
- Índices no Firestore
- Queries otimizadas
- Cache de operações comuns

## Escalabilidade

- Firestore escala automaticamente
- Backend stateless (fácil de replicar)
- CDN para frontend estático

## Monitoramento

- Logs do Firebase Console
- Health check endpoint: `GET /api/health`
- Error logging no backend

---

**Última Atualização**: Maio 2026
