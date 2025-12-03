# 🚀 Guia de Início Rápido - RPA ROI Navigator

Este guia ajudará você a executar a aplicação localmente em poucos minutos.

## 📋 Pré-requisitos

- Node.js 18+ instalado ([Download](https://nodejs.org))
- Conta Firebase ([Criar conta](https://firebase.google.com))
- Git instalado

## ⚡ Setup Rápido

### 1. Clone o Repositório

```bash
git clone <seu-repositorio>
cd rpa-calculator
```

### 2. Configure o Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com)
2. Crie um novo projeto
3. Habilite o Firestore Database
4. Obtenha as credenciais:
   - **Admin SDK**: Configurações → Contas de serviço → Gerar nova chave privada
   - **Client SDK**: Configurações → Seus aplicativos → Web

### 3. Configure o Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` (copie de `.env.example`):

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais do Firebase:

```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-projeto.iam.gserviceaccount.com
ALLOWED_ORIGINS=http://localhost:5173
```

Inicialize o Firestore com dados padrão:

```bash
node src/scripts/initFirestore.js
```

Inicie o servidor:

```bash
npm run dev
```

O backend estará rodando em `http://localhost:5000`

### 4. Configure o Frontend

Abra um novo terminal:

```bash
cd frontend
npm install
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais:

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

Inicie o dev server:

```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## ✅ Verificação

1. Acesse `http://localhost:5173`
2. Você verá o wizard de cálculo de ROI
3. Preencha os dados de um projeto de exemplo
4. Clique em "Calcular ROI"
5. Visualize o dashboard com os resultados

## 🎯 Próximos Passos

- [ ] Explore o código em `backend/src/services/calculationService.js` para entender a lógica de cálculo
- [ ] Customize o tema em `frontend/src/App.jsx`
- [ ] Ajuste as taxas padrão no Firestore (coleção `settings`)
- [ ] Leia a documentação completa em `API.md`
- [ ] Prepare o deploy seguindo `DEPLOY.md`

## 🐛 Problemas Comuns

### Backend não inicia

**Erro**: `Firebase Admin initialization failed`

**Solução**: Verifique se a `FIREBASE_PRIVATE_KEY` está correta. Certifique-se de manter os `\n` na string.

### CORS Error no Frontend

**Erro**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solução**: Verifique se `ALLOWED_ORIGINS` no backend inclui `http://localhost:5173`

### Firestore Permission Denied

**Erro**: `Missing or insufficient permissions`

**Solução**: 
1. Vá no Console do Firebase → Firestore → Regras
2. Configure as regras para permitir leitura/escrita em desenvolvimento:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Apenas para desenvolvimento!
    }
  }
}
```

### Build do Frontend falha

**Erro**: `Module not found` ou `Cannot find module`

**Solução**: 
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentação

- [README.md](README.md) - Visão geral do projeto
- [API.md](API.md) - Documentação completa da API
- [DEPLOY.md](DEPLOY.md) - Guia de deploy para produção
- [backend/README.md](backend/README.md) - Documentação do backend
- [frontend/README.md](frontend/README.md) - Documentação do frontend

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do terminal
2. Consulte a documentação relevante
3. Revise as configurações do Firebase
4. Teste as credenciais manualmente

## 🎉 Tudo Funcionando?

Parabéns! Você está pronto para:

- Criar simulações de ROI
- Customizar a aplicação
- Preparar o deploy para produção

Boa codificação! 🚀
