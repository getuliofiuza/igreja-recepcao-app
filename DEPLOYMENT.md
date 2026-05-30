# 🚀 Guia de Deployment - Igreja Recepção App

## Visão Geral

Este guia mostra como fazer o deploy do seu app para que ele fique acessível pela internet (com URL pública), permitindo que as pessoas acessem via QR Code.

## 📋 Opções de Deployment

### 1️⃣ **Vercel (Recomendado para Frontend) - MAIS FÁCIL** ⭐

Vercel é a forma mais rápida de colocar seu app online.

#### Passo a Passo:

```bash
# 1. Instale Vercel CLI
npm install -g vercel

# 2. Acesse a pasta do frontend
cd /Users/getuliofiuza/igreja-recepcao-app/frontend

# 3. Faça deploy
vercel

# Siga as instruções:
# - Conecte sua conta GitHub/Google
# - Selecione "Create a new project"
# - Configure as variáveis de ambiente (.env)
# - Clique em Deploy
```

**Resultado:** `https://seu-projeto.vercel.app`

#### Configurar Variáveis de Ambiente:

No painel da Vercel:
1. Vá para Settings → Environment Variables
2. Adicione:
   ```
   REACT_APP_API_URL=https://seu-backend.onrender.com/api
   ```

### 2️⃣ **Heroku (Backend) - Fácil** 

Deploy do servidor Node.js

```bash
# 1. Instale Heroku CLI
# Mac: brew install heroku
# Ou em https://devcenter.heroku.com/articles/heroku-cli

# 2. Acesse a pasta do backend
cd /Users/getuliofiuza/igreja-recepcao-app/backend

# 3. Login no Heroku
heroku login

# 4. Crie o app
heroku create seu-app-backend

# 5. Configure as variáveis de ambiente
heroku config:set FIREBASE_DATABASE_URL=seu_url_firebase
heroku config:set FIREBASE_SERVICE_ACCOUNT=seu_json_serviceaccount

# 6. Deploy
git push heroku main
```

**Resultado:** `https://seu-app-backend.herokuapp.com`

### 3️⃣ **Render (Backend) - Alternativa ao Heroku**

```bash
# 1. Acesse https://render.com
# 2. Clique em "New +" → "Web Service"
# 3. Conecte seu repositório GitHub
# 4. Configure:
#    - Build Command: npm install
#    - Start Command: npm start
# 5. Configure as variáveis de ambiente (FIREBASE_*)
# 6. Deploy
```

**Resultado:** `https://seu-app-backend.onrender.com`

### 4️⃣ **Netlify (Frontend) - Alternativa ao Vercel**

```bash
# 1. Instale Netlify CLI
npm install -g netlify-cli

# 2. Acesse a pasta do frontend
cd frontend

# 3. Build
npm run build

# 4. Deploy
netlify deploy --prod --dir=build
```

**Resultado:** `https://seu-app.netlify.app`

## 🔐 Configurar Firestore para Produção

Quando for ao ar, você PRECISA configurar regras de segurança no Firebase!

### No Firebase Console:

1. Vá para **Firestore Database** → **Rules**
2. Substitua as regras por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para todos (desenvolvimento)
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Para produção com autenticação (recomendado):
    // match /{document=**} {
    //   allow read, write: if request.auth != null;
    // }
  }
}
```

3. Clique em **Publicar**

## 📱 Gerar QR Code com URL Pública

Após fazer deploy:

1. Acesse a aplicação
2. Clique no botão **"QR Code"** no topo
3. Vá para **Configurações**
4. Configure a **URL Pública** com sua URL de produção:
   ```
   https://seu-app.vercel.app
   ```
5. Clique em **Salvar URL**
6. Volte e clique em **"Gerar QR Code"**
7. Baixe o QR Code e imprima!

## 📊 Arquitetura de Produção

```
┌─────────────────┐
│  QR Code Print  │
│  (Papel/Poster) │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────┐
│  https://seu-app.vercel.app │ (Frontend)
└────────┬────────────────────┘
         │
         ↓ (API Calls)
┌─────────────────────────────────────┐
│ https://seu-app-backend.onrender.com│ (Backend)
└────────┬────────────────────────────┘
         │
         ↓
┌────────────────────────────────────┐
│     Firebase Firestore (Nuvem)     │
│  - pessoas                         │
│  - presencas                       │
│  - contatos                        │
│  - acompanhamento                  │
└────────────────────────────────────┘
```

## 🧪 Testar em Produção

1. **Teste a URL pública:**
   ```
   https://seu-app.vercel.app
   ```

2. **Teste a API:**
   ```
   https://seu-app-backend.onrender.com/api/health
   ```
   (Deve retornar `{"status":"OK"}`)

3. **Escaneie o QR Code** com um celular diferente

4. **Crie alguns cadastros de teste** e verifique se aparecem no Firebase

## 🎯 Checklist de Deploy

- [ ] Frontend deployado (Vercel/Netlify)
- [ ] Backend deployado (Heroku/Render)
- [ ] Variáveis de ambiente configuradas
- [ ] Firebase conectado
- [ ] Firestore Rules publicadas
- [ ] URL Pública configurada no app
- [ ] QR Code gerado e testado
- [ ] Dados salvando no Firebase ✓

## 🚨 Troubleshooting

### "Erro 404 ao acessar a URL"
- Verifique se o deploy completou
- Espere 2-3 minutos para a URL ficar ativa
- Limpe o cache do navegador

### "API não responde"
- Verifique se o backend foi deployado
- Confirme as variáveis de ambiente Firebase
- Teste em http://localhost:3000 primeiro

### "Dados não salvam no Firebase"
- Verifique as Firestore Rules
- Confirme que o serviço está ativado
- Veja o console do navegador (F12) para erros

### "QR Code não funciona"
- Certifique-se de que a URL está correta
- Teste escaneando com outro celular
- Gere um novo QR Code após atualizar a URL

## 💡 Dicas Importantes

1. **Backup de dados:** Firebase faz backup automático
2. **Monitoramento:** Use Firebase Console para ver tráfego
3. **Domínio customizado:** Você pode apontar um domínio próprio para Vercel/Render
4. **HTTPS:** Todos os serviços oferecem HTTPS automático
5. **Escalabilidade:** Firestore escala automaticamente com o crescimento

## 📞 Próximas Etapas

1. Configure um domínio customizado (opcional)
   ```
   seu-dominio.com → seu-app.vercel.app
   ```

2. Ative autenticação no Firebase (depois)
   - Login de usuários
   - Permissões por papel

3. Configure CORS no backend:
   ```javascript
   app.use(cors({
     origin: 'https://seu-app.vercel.app'
   }));
   ```

---

**Versão**: 1.0.0  
**Última Atualização**: Maio 2026

Qualquer dúvida, consulte a documentação oficial:
- Vercel: https://vercel.com/docs
- Firebase: https://firebase.google.com/docs
- Render: https://render.com/docs
