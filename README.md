# 🏰 Sistema de Recepção de Igreja

Um aplicativo web moderno e completo para gerenciar a recepção, cadastro de pessoas, registro de presenças, acompanhamento de visitantes e muito mais para sua congregação.

## ✨ Recursos Principais

- **👥 Cadastro de Pessoas** - Registro completo de membros e visitantes
- **📅 Registro de Presenças** - Acompanhe a frequência nos cultos e eventos
- **🎯 Gerenciamento de Visitantes** - Converta visitantes em membros
- **📞 Log de Contatos** - Acompanhe contatos e follow-ups
- **🎂 Aniversariantes** - Lembretes automáticos de aniversários
- **📊 Dashboard** - Visualização de estatísticas e resumos executivos
- **📋 Listas Úteis** - Relatórios e exportação de dados

## 🚀 Instalação

### Pré-requisitos
- Node.js (v14 ou superior)
- npm ou yarn
- Firebase Account (com Firestore ativado)

### 1. Clonar o repositório

```bash
cd igreja-recepcao-app
```

### 2. Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative o Firestore Database
3. Crie uma chave privada de serviço:
   - Acesse Project Settings → Service Accounts
   - Clique em "Generate New Private Key"
   - Copie o JSON gerado

### 3. Configurar Backend

```bash
cd backend
npm install

# Edite o arquivo .env com suas credenciais Firebase
# Copie o conteúdo do JSON da chave privada para FIREBASE_SERVICE_ACCOUNT
nano .env

# Inicie o servidor
npm run dev
```

O backend estará disponível em `http://localhost:5000`

### 4. Configurar Frontend

```bash
cd ../frontend
npm install

# Edite o arquivo .env com suas credenciais Firebase
nano .env

# Inicie o aplicativo
npm start
```

O aplicativo estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
igreja-recepcao-app/
├── backend/
│   ├── server.js          # Servidor Express
│   ├── package.json       # Dependências
│   └── .env              # Variáveis de ambiente
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Componente principal
│   │   ├── App.css        # Estilos principais
│   │   ├── index.js       # Entrada da aplicação
│   │   └── pages/         # Componentes de página
│   │       ├── Dashboard.jsx
│   │       ├── Cadastro.jsx
│   │       ├── Presencas.jsx
│   │       ├── Visitantes.jsx
│   │       ├── Contatos.jsx
│   │       └── Aniversariantes.jsx
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env
└── README.md
```

## 🔐 Variáveis de Ambiente

### Backend (.env)
```
PORT=5000
FIREBASE_DATABASE_URL=seu_url_firebase
FIREBASE_SERVICE_ACCOUNT=seu_json_serviceaccount
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=sua_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_dominio
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto
```

## 📊 Estrutura de Dados no Firebase

### Collection: pessoas
```javascript
{
  nomeCompleto: "String",
  dataNascimento: "Date",
  sexo: "String",
  estadoCivil: "String",
  telefone: "String",
  email: "String",
  bairro: "String",
  tipoPessoa: "Visitante|Membro|Líder",
  batizado: "Boolean",
  ministerio: "String",
  observacoes: "String",
  dataCadastro: "Date"
}
```

### Collection: presencas
```javascript
{
  pessoaId: "String",
  data: "Date",
  evento: "String",
  observacoes: "String",
  criadoEm: "Date"
}
```

### Collection: contatos
```javascript
{
  pessoaId: "String",
  tipo: "WhatsApp|Telefone|Email|Visita",
  descricao: "String",
  proximoContato: "Date",
  data: "Date",
  status: "Pendente|Concluído"
}
```

## 🎨 Customização

### Cores
As cores principais estão em `frontend/src/App.css`. Você pode mudar os gradientes:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Logo/Branding
Edite o logo na sidebar em `frontend/src/App.jsx`:
```jsx
<div className="logo-section">
  <h1>🏰 Sua Igreja</h1>
  <p>Recepção</p>
</div>
```

## 🚀 Deploy

### Heroku (Backend)

```bash
cd backend
npm install -g heroku
heroku login
heroku create seu-app-name
git push heroku main
```

### Vercel ou Netlify (Frontend)

```bash
cd frontend
npm run build
# Faça upload da pasta 'build'
```

## 📝 Uso

1. **Cadastrar Pessoas**: Acesse a aba "Cadastro" e clique em "Nova Pessoa"
2. **Registrar Presenças**: Vá para "Presenças", selecione a pessoa e registre
3. **Converter Visitantes**: Na aba "Visitantes", clique em "Converter" para membros
4. **Acompanhar Contatos**: Use "Contatos" para registrar follow-ups
5. **Ver Aniversariantes**: Acesse "Aniversariantes" para lembretes de datas
6. **Dashboard**: Veja um resumo geral no painel principal

## 🐛 Troubleshooting

### Backend não conecta ao Firebase
- Verifique se o JSON da chave privada está correto em `.env`
- Certifique-se de que o Firestore está ativado no Firebase Console

### Frontend não conecta ao Backend
- Verifique se o backend está rodando em `http://localhost:5000`
- Confirme que `REACT_APP_API_URL` está correto em `.env`

### CORS errors
- Adicione a origem do frontend no backend (configure CORS no `server.js`)

## 📞 Suporte

Para dúvidas ou problemas, entre em contato ou abra uma issue no repositório.

## 📄 Licença

Este projeto é de código aberto. Sinta-se livre para usar, modificar e distribuir conforme necessário para sua congregação.

---

**Versão**: 1.0.0  
**Última Atualização**: Maio 2026
