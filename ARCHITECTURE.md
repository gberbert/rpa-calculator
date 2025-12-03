# 🏗️ Arquitetura Técnica - RPA ROI Navigator

Documentação completa da arquitetura e decisões técnicas do projeto.

## 📐 Visão Geral

O RPA ROI Navigator é uma aplicação PWA (Progressive Web App) full-stack para cálculo e projeção de ROI de automações RPA, focada em grandes corporações do setor de energia.

### Stack Tecnológica

**Frontend**
- React 18 + Vite
- Material UI (Design System)
- Recharts (Visualização de dados)
- Axios (HTTP Client)
- Firebase SDK (Client)
- PWA (Service Worker + Manifest)

**Backend**
- Node.js + Express
- Firebase Admin SDK
- Helmet (Segurança)
- Morgan (Logging)
- CORS

**Database**
- Firebase Firestore (NoSQL)

**Infraestrutura**
- Render (Web Service + Static Site)

## 🎯 Arquitetura de Alto Nível

```
┌─────────────────┐
│   Navegador     │
│   (PWA Client)  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Static Site    │
│  (Render)       │
│  - React App    │
│  - Service      │
│    Worker       │
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────┐
│  Web Service    │
│  (Render)       │
│  - Express API  │
│  - Business     │
│    Logic        │
└────────┬────────┘
         │ Firebase Admin SDK
         ▼
┌─────────────────┐
│   Firestore     │
│   (Firebase)    │
│  - settings     │
│  - projects     │
└─────────────────┘
```

## 📊 Modelagem de Dados

### Coleção: `settings`

**Documento**: `global_config`

```javascript
{
  rates: {
    dev_hourly: Number,      // Taxa horária desenvolvedor
    analyst_hourly: Number,  // Taxa horária analista
    infra_annual: Number,    // Custo anual infraestrutura
    license_annual: Number   // Custo anual licenças RPA
  },
  baselines: {
    low: Number,    // Horas totais complexidade baixa
    medium: Number, // Horas totais complexidade média
    high: Number    // Horas totais complexidade alta
  },
  updated_at: Timestamp
}
```

### Coleção: `projects`

**Documentos**: Um por projeto/simulação

```javascript
{
  project_name: String,
  owner_uid: String,
  created_at: Timestamp,
  updated_at: Timestamp,
  
  inputs_as_is: {
    volume: Number,      // Volume mensal de transações
    aht: Number,         // Average Handle Time (minutos)
    fte_cost: Number,    // Custo mensal FTE (R$)
    error_rate: Number   // Taxa de erro humano (%)
  },
  
  complexity_input: {
    numApplications: Number,  // Número de aplicações
    dataType: String,         // 'structured' | 'text' | 'ocr'
    environment: String,      // 'web' | 'sap' | 'citrix'
    numSteps: Number          // Número de passos/regras
  },
  
  complexity_score: {
    total_points: Number,        // Pontuação total (4-15+)
    classification: String,      // 'LOW' | 'MEDIUM' | 'HIGH'
    hours: {
      devHours: Number,
      analystHours: Number,
      totalHours: Number
    }
  },
  
  results: {
    development_cost: Number,
    as_is_cost_annual: Number,
    to_be_cost_annual: Number,
    roi_year_1: Number,
    annual_savings: Number,
    monthly_savings: Number,
    payback_months: Number,
    cost_breakdown: {
      licenseCost: Number,
      infraCost: Number,
      maintenanceCost: Number,
      exceptionCost: Number,
      totalToBeCost: Number
    }
  }
}
```

## 🧮 Regras de Negócio

### 1. Matriz de Complexidade

A complexidade é calculada através de um sistema de pontuação oculto ao usuário:

**Critérios e Pontuação:**

| Critério | Opção | Pontos |
|----------|-------|--------|
| **Nº Aplicações** | 1-2 | 1 |
| | 3-4 | 2 |
| | 5+ | 3 |
| **Tipo de Dados** | Estruturados | 1 |
| | Texto/E-mail | 2 |
| | Imagem/OCR | 5 |
| **Ambiente** | Web/Local | 1 |
| | SAP/Mainframe | 2 |
| | Citrix/Remoto | 4 |
| **Nº Passos** | <20 | 1 |
| | 20-50 | 3 |
| | >50 | 5 |

**Classificação:**

| Pontuação | Classificação | Dev | Análise | Total |
|-----------|---------------|-----|---------|-------|
| 4-6 | BAIXA | 80h | 24h | 104h |
| 7-11 | MÉDIA | 160h | 48h | 208h |
| 12+ | ALTA | 320h | 96h | 416h |

### 2. Fórmulas Financeiras

#### Custo AS-IS (Anual)

```
Custo_Minuto_FTE = fteCost / 9600
  onde 9600 = 160h/mês × 60min/h

Custo_AS_IS_Anual = (volume × aht × 12) × Custo_Minuto_FTE × (1 + errorRate/100)
```

**Exemplo:**
- Volume: 5.000 transações/mês
- AHT: 10 minutos
- FTE Cost: R$ 8.000/mês
- Error Rate: 5%

```
Custo_Minuto = 8000 / 9600 = R$ 0,833
Custo_AS_IS = (5000 × 10 × 12) × 0,833 × 1,05 = R$ 524.900
```

#### Custo de Desenvolvimento

```
Custo_Dev = (devHours × dev_hourly) + (analystHours × analyst_hourly)
```

**Exemplo (Complexidade MÉDIA):**
```
Custo_Dev = (160 × 120) + (48 × 150) = R$ 26.400
```

#### Custo TO-BE (Anual)

```
Custo_Licenças = license_annual (padrão: R$ 15.000)
Custo_Infra = infra_annual (padrão: R$ 5.000)
Custo_Manutenção = Custo_Dev × 0,15
Custo_Exceções = 0 (simplificado)

Custo_TO_BE = Custo_Licenças + Custo_Infra + Custo_Manutenção + Custo_Exceções
```

**Exemplo:**
```
Custo_TO_BE = 15000 + 5000 + (26400 × 0,15) + 0 = R$ 23.960
```

#### ROI Ano 1

```
Economia_Anual = Custo_AS_IS - Custo_TO_BE
ROI = ((Economia_Anual - Custo_Dev) / Custo_Dev) × 100
```

**Exemplo:**
```
Economia = 524900 - 23960 = R$ 500.940
ROI = ((500940 - 26400) / 26400) × 100 = 1.797%
```

#### Payback Period

```
Economia_Mensal = Economia_Anual / 12
Payback_Meses = Custo_Dev / Economia_Mensal
```

**Exemplo:**
```
Economia_Mensal = 500940 / 12 = R$ 41.745
Payback = 26400 / 41745 = 0,63 meses (~19 dias)
```

## 🔄 Fluxo de Dados

### Criação de Projeto

```
1. Frontend: Usuário preenche wizard (4 steps)
   ↓
2. Frontend: Valida dados localmente
   ↓
3. Frontend: POST /api/projects
   ↓
4. Backend: Valida payload
   ↓
5. Backend: Busca taxas globais (Firestore)
   ↓
6. Backend: Calcula complexidade (ComplexityService)
   ↓
7. Backend: Calcula indicadores financeiros (FinancialService)
   ↓
8. Backend: Salva projeto (Firestore)
   ↓
9. Backend: Retorna resultado completo
   ↓
10. Frontend: Exibe dashboard de resultados
```

### Atualização de Configurações

```
1. Admin: PUT /api/settings
   ↓
2. Backend: Valida dados
   ↓
3. Backend: Atualiza Firestore (settings/global_config)
   ↓
4. Próximos cálculos usarão novas taxas
```

## 🔐 Segurança

### Backend

- **Helmet**: Headers de segurança HTTP
- **CORS**: Configurável por ambiente
- **Input Validation**: Validação de todos os payloads
- **Firebase Admin SDK**: Autenticação segura com Firestore

### Frontend

- **HTTPS**: Obrigatório em produção
- **Input Sanitization**: Validação de formulários
- **Environment Variables**: Credenciais via variáveis de ambiente
- **CSP**: Content Security Policy via Helmet

### Firestore

**Regras de Segurança (Produção):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Configurações: leitura pública, escrita apenas via Admin SDK
    match /settings/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Projetos: autenticação futura
    match /projects/{projectId} {
      allow read, write: if request.auth != null; // TODO: Implementar
    }
  }
}
```

## 📈 Performance

### Frontend

- **Code Splitting**: Vite faz automaticamente
- **Lazy Loading**: Componentes carregados sob demanda
- **Service Worker**: Cache de assets estáticos
- **Minificação**: Build otimizado para produção

### Backend

- **Firestore Caching**: Cache de configurações globais
- **Async/Await**: Operações não-bloqueantes
- **Connection Pooling**: Firebase Admin SDK gerencia

### Database

- **Índices**: Criados automaticamente pelo Firestore
- **Queries Otimizadas**: Filtros e ordenação no servidor
- **Paginação**: Preparado para implementação futura

## 🧪 Testes (Roadmap)

### Backend

- Unit Tests: Jest
- Integration Tests: Supertest
- Coverage: >80%

### Frontend

- Unit Tests: Vitest
- Component Tests: React Testing Library
- E2E Tests: Playwright

## 📦 Deploy

### Estratégia

- **Backend**: Render Web Service (Always On em produção)
- **Frontend**: Render Static Site (CDN global)
- **Database**: Firebase (Multi-region)

### CI/CD (Roadmap)

```
Git Push → GitHub Actions → Tests → Build → Deploy
```

## 🔮 Roadmap Futuro

### Fase 2: Autenticação
- Firebase Authentication
- Login com Google/Microsoft
- Controle de acesso por usuário

### Fase 3: Colaboração
- Compartilhamento de projetos
- Comentários e anotações
- Histórico de versões

### Fase 4: Analytics
- Dashboard executivo
- Comparação de projetos
- Exportação para Excel/PDF

### Fase 5: IA/ML
- Sugestões de otimização
- Previsão de ROI baseada em histórico
- Detecção de anomalias

## 📚 Referências

- [React Documentation](https://react.dev)
- [Material UI](https://mui.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js](https://expressjs.com)
- [Render Documentation](https://render.com/docs)

## 📄 Licença

Proprietary - Uso Corporativo

---

**Versão**: 1.0.0  
**Última Atualização**: 2024-01-15  
**Autor**: Arquiteto de Software Sênior
