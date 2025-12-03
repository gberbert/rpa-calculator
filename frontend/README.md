# Frontend - RPA ROI Navigator

Aplicação PWA para cálculo de ROI de automações RPA.

## 🚀 Tecnologias

- React 18
- Vite
- Material UI
- Recharts (Gráficos)
- Axios
- Firebase SDK
- PWA Support

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Backend API rodando
- Credenciais do Firebase (Client SDK)

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 🏃 Executando

### Desenvolvimento
```bash
npm run dev
```

### Build de Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

A aplicação estará disponível em `http://localhost:5173`

## 🎨 Funcionalidades

### Wizard Multi-Step
1. **Informações do Projeto** - Nome e responsável
2. **Cenário AS-IS** - Volume, AHT, custo FTE, taxa de erro
3. **Complexidade** - Aplicações, tipo de dados, ambiente, passos
4. **Revisão** - Confirmação dos dados

### Dashboard de Resultados
- KPIs principais (ROI, Economia, Payback, Complexidade)
- Gráfico de comparação de custos (AS-IS vs TO-BE)
- Gráfico de composição de custos TO-BE
- Projeção de payback mensal
- Detalhamento financeiro completo

## 🎨 Design System

### Cores Principais
- Primary: `#667eea` (Roxo/Azul)
- Secondary: `#764ba2` (Roxo Escuro)
- Success: `#10b981` (Verde)
- Warning: `#f59e0b` (Laranja)
- Error: `#ef4444` (Vermelho)

### Tipografia
- Família: Inter (Google Fonts)
- Pesos: 300, 400, 500, 600, 700

### Componentes
- Gradientes vibrantes
- Sombras suaves
- Border radius: 8px
- Animações micro-interativas

## 📱 PWA

A aplicação é uma Progressive Web App completa:
- Instalável no dispositivo
- Funciona offline (service worker)
- Ícones otimizados (192x192, 512x512)
- Manifest configurado

## 📦 Deploy (Render Static Site)

1. Build Command: `npm install && npm run build`
2. Publish Directory: `dist`
3. Configure as variáveis de ambiente no painel do Render

## 🔒 Segurança

- Validação de inputs no frontend
- Comunicação segura com API (HTTPS em produção)
- Firebase SDK para autenticação futura

## 📄 Licença

Proprietary - Uso Corporativo
