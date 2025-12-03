# 🚀 Guia de Deploy - RPA ROI Navigator

Este guia detalha o processo de deploy da aplicação no Render.

## 📋 Pré-requisitos

1. Conta no [Render](https://render.com)
2. Conta no [Firebase](https://firebase.google.com)
3. Repositório Git (GitHub, GitLab ou Bitbucket)
4. Credenciais do Firebase Admin SDK

## 🔥 Configuração do Firebase

### 1. Criar Projeto Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Siga o assistente de criação

### 2. Habilitar Firestore

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha o modo de produção
4. Selecione a região (southamerica-east1 para Brasil)

### 3. Obter Credenciais Admin SDK

1. Vá em "Configurações do projeto" (ícone de engrenagem)
2. Aba "Contas de serviço"
3. Clique em "Gerar nova chave privada"
4. Salve o arquivo JSON

### 4. Obter Credenciais Client SDK

1. Na mesma tela de configurações
2. Role até "Seus aplicativos"
3. Clique no ícone Web (</>)
4. Copie as configurações do Firebase

### 5. Inicializar Firestore

No backend, após configurar o `.env`:

```bash
cd backend
node src/scripts/initFirestore.js
```

## 🌐 Deploy do Backend (Render Web Service)

### 1. Criar Web Service

1. Acesse o [Dashboard do Render](https://dashboard.render.com)
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório Git
4. Configure:
   - **Name**: `rpa-roi-navigator-api`
   - **Region**: Oregon (US West) ou Frankfurt (EU)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (ou Starter para produção)

### 2. Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

```
PORT=5000
NODE_ENV=production
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-projeto.iam.gserviceaccount.com
ALLOWED_ORIGINS=https://seu-frontend.onrender.com
```

**Importante**: Para a `FIREBASE_PRIVATE_KEY`, copie o conteúdo do arquivo JSON baixado, campo `private_key`, mantendo os `\n`.

### 3. Deploy

1. Clique em "Create Web Service"
2. Aguarde o deploy (3-5 minutos)
3. Anote a URL gerada (ex: `https://rpa-roi-navigator-api.onrender.com`)

### 4. Testar

```bash
curl https://rpa-roi-navigator-api.onrender.com/api/health
```

Deve retornar:
```json
{
  "success": true,
  "message": "RPA ROI Navigator API is running",
  "timestamp": "2024-..."
}
```

## 🎨 Deploy do Frontend (Render Static Site)

### 1. Criar Static Site

1. No Dashboard do Render, clique em "New +" → "Static Site"
2. Conecte o mesmo repositório
3. Configure:
   - **Name**: `rpa-roi-navigator`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 2. Configurar Variáveis de Ambiente

Na seção "Environment Variables":

```
VITE_API_URL=https://rpa-roi-navigator-api.onrender.com
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 3. Deploy

1. Clique em "Create Static Site"
2. Aguarde o build (2-4 minutos)
3. Acesse a URL gerada (ex: `https://rpa-roi-navigator.onrender.com`)

## 🔄 Atualizar CORS no Backend

Após o deploy do frontend, atualize a variável `ALLOWED_ORIGINS` no backend:

```
ALLOWED_ORIGINS=https://rpa-roi-navigator.onrender.com,http://localhost:5173
```

Clique em "Manual Deploy" → "Deploy latest commit" para aplicar.

## 📊 Regras de Segurança do Firestore

No Console do Firebase, vá em "Firestore Database" → "Regras":

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura das configurações globais
    match /settings/{document=**} {
      allow read: if true;
      allow write: if false; // Apenas via Admin SDK
    }
    
    // Projetos: permitir leitura/escrita (adicionar autenticação futuramente)
    match /projects/{projectId} {
      allow read, write: if true; // TODO: Adicionar autenticação
    }
  }
}
```

Clique em "Publicar".

## ✅ Checklist de Deploy

- [ ] Firebase criado e Firestore habilitado
- [ ] Credenciais Admin SDK obtidas
- [ ] Credenciais Client SDK obtidas
- [ ] Firestore inicializado com dados padrão
- [ ] Backend deployado no Render
- [ ] Variáveis de ambiente do backend configuradas
- [ ] Health check do backend funcionando
- [ ] Frontend deployado no Render
- [ ] Variáveis de ambiente do frontend configuradas
- [ ] CORS atualizado no backend
- [ ] Regras de segurança do Firestore configuradas
- [ ] Aplicação testada end-to-end

## 🔧 Troubleshooting

### Backend não inicia

- Verifique os logs no Render
- Confirme que a `FIREBASE_PRIVATE_KEY` está correta (com `\n`)
- Teste localmente com as mesmas variáveis

### CORS Error

- Verifique se a URL do frontend está em `ALLOWED_ORIGINS`
- Certifique-se de usar HTTPS em produção

### Firestore Permission Denied

- Verifique as regras de segurança
- Confirme que as credenciais estão corretas

### Build do Frontend falha

- Verifique se todas as variáveis `VITE_*` estão configuradas
- Teste o build localmente: `npm run build`

## 📈 Monitoramento

### Render

- Acesse o dashboard de cada serviço
- Monitore logs em tempo real
- Configure alertas de downtime

### Firebase

- Console do Firebase → "Uso e faturamento"
- Monitore leituras/escritas do Firestore
- Configure alertas de quota

## 🎉 Pronto!

Sua aplicação está no ar! Acesse:

- **Frontend**: `https://rpa-roi-navigator.onrender.com`
- **API**: `https://rpa-roi-navigator-api.onrender.com`

## 📞 Suporte

Para problemas ou dúvidas:
- Documentação do Render: https://render.com/docs
- Documentação do Firebase: https://firebase.google.com/docs
