# 🚀 Guia Rápido - Igreja Recepção App

## ⚡ Inicio em 5 Minutos

### 1️⃣ Preparar Firebase (5 min)

1. Acesse https://console.firebase.google.com
2. Clique em "Criar Projeto"
3. Defina um nome (ex: "Igreja-Recepcao")
4. Clique em "Criar Projeto"
5. Aguarde a criação
6. Na lateral, clique em "Firestore Database"
7. Clique em "Criar Banco de Dados"
8. Selecione "Iniciar no modo de teste"
9. Selecione a localização (ex: nam5 - EUA)
10. Aguarde a criação

### 2️⃣ Obter Chave de Serviço

1. No Firebase, clique no ícone de engrenagem (⚙️) → Configurações do Projeto
2. Vá para a aba "Contas de Serviço"
3. Selecione "Node.js"
4. Clique em "Gerar nova chave privada"
5. Um arquivo JSON será baixado - **GUARDE ESTE ARQUIVO**

### 3️⃣ Clonar e Instalar Backend

```bash
# Clone o projeto
cd igreja-recepcao-app/backend

# Instale dependências
npm install

# Abra o arquivo .env
# Cole o conteúdo do JSON da chave privada no campo FIREBASE_SERVICE_ACCOUNT
nano .env
```

**Exemplo do .env:**
```
PORT=5000
FIREBASE_DATABASE_URL=https://seu-projeto-firebase.firebaseio.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### 4️⃣ Instalar Frontend

```bash
cd ../frontend

# Instale dependências
npm install

# Abra o arquivo .env e deixe como está (usa localhost por padrão)
# Se precisar, edite REACT_APP_API_URL
nano .env
```

### 5️⃣ Iniciar Aplicação

**Em um terminal (Backend):**
```bash
cd backend
npm run dev
# Verá: "🚀 Servidor rodando na porta 5000"
```

**Em outro terminal (Frontend):**
```bash
cd frontend
npm start
# Abrirá automaticamente em http://localhost:3000
```

## 🎉 Pronto!

Você tem um aplicativo completo funcionando:

| Funcionalidade | URL |
|---|---|
| **App** | http://localhost:3000 |
| **API Backend** | http://localhost:5000/api |
| **Health Check** | http://localhost:5000/api/health |

## 🎯 Primeiros Passos

1. Vá para http://localhost:3000
2. Clique em "Cadastro"
3. Clique em "Nova Pessoa"
4. Preencha o formulário e clique em "Salvar"
5. Pronto! Você está criando seu primeiro cadastro!

## 🐛 Problemas Comuns

### "Erro de conexão com Firebase"
- Verifique se o JSON está correto em `.env`
- Certifique-se de que o Firestore foi criado

### "Frontend não encontra o Backend"
- Verifique se o backend está rodando em http://localhost:5000
- Abra http://localhost:5000/api/health no navegador para confirmar

### "npm: comando não encontrado"
- Instale Node.js em https://nodejs.org
- Reinicie seu terminal

## 📱 Deploy (Opcional)

### Heroku (Backend)
```bash
heroku create seu-app-backend
cd backend
git push heroku main
```

### Vercel (Frontend)
```bash
cd frontend
npm run build
vercel --prod
```

## 📚 Próximas Leituras

- Veja [README.md](./README.md) para documentação completa
- Customize as cores em `frontend/src/App.css`
- Adicione mais campos em `frontend/src/pages/Cadastro.jsx`

## ✉️ Suporte

Se tiver dúvidas, entre em contato ou abra uma issue!

---

**Boa sorte! 🎊**
