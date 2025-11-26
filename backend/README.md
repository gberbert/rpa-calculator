# Backend - RPA ROI Navigator API

API REST para cálculo de ROI de automações RPA.

## 🚀 Tecnologias

- Node.js + Express
- Firebase Firestore
- Helmet (Segurança)
- Morgan (Logging)
- CORS

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta Firebase com Firestore habilitado
- Credenciais do Firebase Admin SDK

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` com suas credenciais do Firebase:
```env
PORT=5000
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-projeto.iam.gserviceaccount.com
```

## 🏃 Executando

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

O servidor estará disponível em `http://localhost:5000`

## 📚 Endpoints

### Health Check
```
GET /api/health
```

### Projetos
```
POST   /api/projects          - Criar novo projeto
GET    /api/projects/:id      - Buscar projeto por ID
GET    /api/projects          - Listar projetos (query: ownerUid)
PUT    /api/projects/:id      - Atualizar projeto
DELETE /api/projects/:id      - Deletar projeto
```

### Configurações
```
GET /api/settings             - Buscar configurações globais
PUT /api/settings             - Atualizar configurações globais
```

## 📊 Exemplo de Payload

### Criar Projeto
```json
{
  "projectName": "Automação de Faturamento",
  "ownerUid": "user123",
  "inputs": {
    "volume": 5000,
    "aht": 10,
    "fteCost": 8000,
    "errorRate": 5
  },
  "complexity": {
    "numApplications": 3,
    "dataType": "structured",
    "environment": "web",
    "numSteps": 25
  }
}
```

## 🔐 Segurança

- Helmet para headers de segurança
- CORS configurável
- Validação de inputs
- Firebase Admin SDK para autenticação segura

## 📦 Deploy (Render)

1. Conecte o repositório no Render
2. Configure como Web Service
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Adicione as variáveis de ambiente no painel do Render

## 📄 Licença

Proprietary - Uso Corporativo
