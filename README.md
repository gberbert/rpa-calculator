# RPA ROI Navigator

Aplicação PWA corporativa para cálculo e projeção de ROI de automações RPA, focada no setor de energia.

## 🚀 Stack Tecnológica

### Frontend
- React.js + Vite
- Material UI (Design Corporativo)
- PWA Support
- Firebase SDK

### Backend
- Node.js + Express
- Firebase Firestore (NoSQL)
- Lógica de Cálculo de ROI e Complexidade

### Infraestrutura
- Deploy: Render (Web Service + Static Site)
- Database: Firebase Firestore

## 📋 Funcionalidades

- ✅ Wizard de entrada de dados (AS-IS)
- ✅ Matriz de Complexidade automática (scoring oculto)
- ✅ Cálculo de ROI, Payback e custos TO-BE
- ✅ Persistência de projetos no Firestore
- ✅ Dashboard de resultados com gráficos
- ✅ Configurações globais centralizadas

## 🏗️ Estrutura do Projeto

```
rpa-calculator/
├── backend/          # API Node.js + Express
├── frontend/         # React PWA
└── README.md
```

## 🔧 Configuração

### Backend

1. Entre na pasta backend:
```bash
cd backend
npm install
```

2. Configure as variáveis de ambiente (`.env`):
```
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

3. Inicie o servidor:
```bash
npm run dev
```

### Frontend

1. Entre na pasta frontend:
```bash
cd frontend
npm install
```

2. Configure o Firebase (`.env`):
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_API_URL=http://localhost:5000
```

3. Inicie o dev server:
```bash
npm run dev
```

## 📊 Regras de Negócio

### Matriz de Complexidade

**Critérios de Pontuação:**
- Nº de Aplicações: 1-2 (1pt) | 3-4 (2pts) | 5+ (3pts)
- Tipo de Dados: Estruturados (1pt) | E-mail/Texto (2pts) | Imagem/OCR (5pts)
- Ambiente: Web/Local (1pt) | SAP/Mainframe (2pts) | Citrix/Remoto (4pts)
- Regras/Passos: <20 (1pt) | 20-50 (3pts) | >50 (5pts)

**Classificação:**
- Baixa (4-6 pts): 80h Dev + 24h Análise
- Média (7-11 pts): 160h Dev + 48h Análise
- Alta (12+ pts): 320h Dev + 96h Análise

### Fórmulas Financeiras

- **Custo AS-IS**: (Volume × AHT × 12) × Custo_Minuto_FTE × (1 + TaxaErro)
- **ROI Ano 1**: ((Custo_AS_IS - Custo_TO_BE) - Custo_Dev_Total) / Custo_Dev_Total × 100
- **Payback Period**: Meses até economia acumulada cobrir investimento

## 🚢 Deploy

### Backend (Render Web Service)
1. Conecte o repositório no Render
2. Configure as variáveis de ambiente
3. Build Command: `cd backend && npm install`
4. Start Command: `cd backend && npm start`

### Frontend (Render Static Site)
1. Build Command: `cd frontend && npm install && npm run build`
2. Publish Directory: `frontend/dist`

## 📄 Licença

Proprietary - Uso Corporativo
