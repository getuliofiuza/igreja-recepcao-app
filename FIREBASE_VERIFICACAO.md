# ☁️ Verificação de Dados no Firebase

## ✅ Como Verificar que os Dados Estão Sendo Salvos

### 1. Acessar Firebase Console

1. Vá para https://console.firebase.google.com
2. Selecione seu projeto "Igreja-Recepcao"
3. No menu lateral, clique em **"Firestore Database"**

### 2. Verificar Collections

Você verá as collections (tabelas):

```
├── pessoas
│   ├── doc1
│   │   ├── nomeCompleto: "Maria Silva"
│   │   ├── dataNascimento: 1990-05-20
│   │   ├── telefone: "(11) 98765-4321"
│   │   └── ...
│   └── doc2
│       ├── nomeCompleto: "João Santos"
│       └── ...
│
├── presencas
│   ├── doc1
│   │   ├── pessoaId: "ref_to_pessoas"
│   │   ├── data: 2026-05-30
│   │   ├── evento: "Culto"
│   │   └── ...
│   └── ...
│
├── contatos
│   ├── doc1
│   │   ├── pessoaId: "ref_to_pessoas"
│   │   ├── tipo: "WhatsApp"
│   │   ├── descricao: "Acompanhamento"
│   │   └── ...
│   └── ...
│
└── acompanhamento
    └── ...
```

## 🔍 Verificação Passo a Passo

### Teste 1: Cadastrar Uma Pessoa

1. Abra http://localhost:3000
2. Vá para **Cadastro**
3. Clique em **"Nova Pessoa"**
4. Preencha os dados:
   - Nome: "Teste Firebase"
   - Data Nascimento: qualquer data
   - Telefone: "(11) 99999-9999"
5. Clique em **"Salvar"**

**Esperado:** A pessoa aparece na tabela

### Verificar no Firebase:

1. Abra Firebase Console → Firestore Database
2. Clique em collection **"pessoas"**
3. Você verá o novo documento com os dados

✅ **Se aparecer:** Os dados estão sendo salvos corretamente!

### Teste 2: Registrar Presença

1. Vá para **Presenças**
2. Selecione a pessoa que acabou de criar
3. Clique em **"Registrar Presença"**
4. Preencha:
   - Data: hoje
   - Evento: "Culto"
5. Clique em **"Salvar"**

**Verificar no Firebase:**

1. Clique em collection **"presencas"**
2. Você verá o novo documento
3. Verifique se `pessoaId` aponta para a pessoa criada

✅ **Se aparecer:** Presença registrada com sucesso!

### Teste 3: Registrar Contato

1. Vá para **Contatos**
2. Clique em **"Novo Contato"**
3. Selecione a pessoa
4. Preencha:
   - Tipo: "WhatsApp"
   - Descrição: "Teste de contato"
5. Clique em **"Salvar"**

**Verificar no Firebase:**

1. Clique em collection **"contatos"**
2. Você verá o novo documento

✅ **Se aparecer:** Contato registrado com sucesso!

## 📊 Estatísticas de Dados

### No Firebase Console:

1. Vá para **Firestore Database** → **Data**
2. Verifique quantos documentos tem em cada collection

**Exemplo:**
```
pessoas:     5 documentos
presencas:   12 documentos
contatos:    8 documentos
acompanhamento: 0 documentos
```

## 🔐 Segurança dos Dados

### Verificar Quem Pode Acessar:

1. Vá para **Firestore Database** → **Rules**
2. Você verá as regras de segurança
3. No desenvolvimento está liberado (para testes)

**Para produção, use:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📈 Monitoramento em Tempo Real

### Ver Activity:

1. Firebase Console → **Firestore Database**
2. Clique em **"Usage"**
3. Você verá:
   - Operações de leitura
   - Operações de escrita
   - Tamanho do banco

## 🚨 Troubleshooting

### "Nenhum dado aparece no Firebase"

**Verifique:**

1. ✓ Credenciais do Firebase estão corretas em `.env`
2. ✓ Firestore está ativado no Firebase Console
3. ✓ Firestore Rules permitem acesso
4. ✓ Não há erros no console do navegador (F12)

**Comando para debug:**
```bash
# No console do navegador (F12):
localStorage.getItem('urlPublica')
window.location.origin
```

### "Erro: Permission denied (do Firestore)"

**Solução:**

1. Firebase Console → Firestore → Rules
2. Verifique se as rules estão corretas
3. Clique em **"Publicar"**

### "Dados aparecem mas depois desaparecem"

**Possíveis causas:**

1. Firestore Rules muito restritivas
2. Banco foi deletado por acidente
3. Período de trial do Firebase expirou

**Solução:**
- Verifique seu plano Firebase (gratuito é limitado)
- Atualize para pago se necessário

## 💾 Fazer Backup dos Dados

### Exportar dados:

1. Firebase Console → **Firestore Database** → **Data**
2. Clique nos 3 pontos → **"Exportar coleção"**
3. Selecione destino (Google Cloud Storage)

### Importar dados:

1. Mesmo lugar → **"Importar coleção"**
2. Selecione o arquivo de backup

## 📱 Verificar no App

Você pode verificar os dados salvos também pela aplicação:

1. **Dashboard:** Mostra total de pessoas cadastradas
2. **Cadastro:** Lista todas as pessoas
3. **Presenças:** Mostra histórico de cada pessoa
4. **Contatos:** Lista contatos pendentes

Se os números batem com o Firebase Console = ✅ Tudo OK!

## 🎯 Checklist

- [ ] Firestore criado no Firebase Console
- [ ] `.env` do backend configurado com credenciais Firebase
- [ ] Firestore Rules publicadas
- [ ] Cadastro de teste criado e aparece no Firebase
- [ ] Presença registrada e aparece no Firebase
- [ ] Contato registrado e aparece no Firebase
- [ ] Dashboard mostra números corretos
- [ ] Dados persistem após recarregar a página

---

**Dica:** Todos os dados estão **seguros e privados** no Firebase. Você controla total acesso!

**Próximo passo:** Faça o deployment para que sua URL seja pública (veja DEPLOYMENT.md)
