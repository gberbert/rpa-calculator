# 📚 API Documentation - RPA ROI Navigator

Documentação completa da API REST.

## Base URL

```
Development: http://localhost:5000/api
Production:  https://rpa-roi-navigator-api.onrender.com/api
```

## 🔐 Autenticação

Atualmente a API não requer autenticação. Em versões futuras, será implementado Firebase Auth.

## 📡 Endpoints

### Health Check

#### GET /health

Verifica o status da API.

**Response 200 OK**
```json
{
  "success": true,
  "message": "RPA ROI Navigator API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Projetos

#### POST /projects

Cria um novo projeto e calcula o ROI.

**Request Body**
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

**Campos**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| projectName | string | Sim | Nome do projeto |
| ownerUid | string | Não | ID do responsável (default: "anonymous") |
| inputs.volume | number | Sim | Volume mensal de transações |
| inputs.aht | number | Sim | Average Handle Time em minutos |
| inputs.fteCost | number | Sim | Custo mensal do FTE em R$ |
| inputs.errorRate | number | Não | Taxa de erro humano em % (default: 0) |
| complexity.numApplications | number | Sim | Número de aplicações integradas |
| complexity.dataType | string | Sim | Tipo de dados: "structured", "text", "ocr" |
| complexity.environment | string | Sim | Ambiente: "web", "sap", "citrix" |
| complexity.numSteps | number | Sim | Número de passos/regras |

**Response 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "abc123def456",
    "project_name": "Automação de Faturamento",
    "owner_uid": "user123",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "inputs_as_is": {
      "volume": 5000,
      "aht": 10,
      "fte_cost": 8000,
      "error_rate": 5
    },
    "complexity_input": {
      "numApplications": 3,
      "dataType": "structured",
      "environment": "web",
      "numSteps": 25
    },
    "complexity_score": {
      "total_points": 8,
      "classification": "MEDIUM",
      "hours": {
        "devHours": 160,
        "analystHours": 48,
        "totalHours": 208
      }
    },
    "results": {
      "development_cost": 26400,
      "as_is_cost_annual": 500000,
      "to_be_cost_annual": 23960,
      "roi_year_1": 1699.24,
      "annual_savings": 476040,
      "monthly_savings": 39670,
      "payback_months": 0.7,
      "cost_breakdown": {
        "licenseCost": 15000,
        "infraCost": 5000,
        "maintenanceCost": 3960,
        "exceptionCost": 0,
        "totalToBeCost": 23960
      }
    }
  }
}
```

**Response 400 Bad Request**
```json
{
  "success": false,
  "error": "Missing required fields: projectName, inputs, complexity"
}
```

---

#### GET /projects/:id

Busca um projeto específico por ID.

**Parameters**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID do projeto |

**Response 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "abc123def456",
    "project_name": "Automação de Faturamento",
    ...
  }
}
```

**Response 404 Not Found**
```json
{
  "success": false,
  "error": "Project not found"
}
```

---

#### GET /projects

Lista todos os projetos de um usuário.

**Query Parameters**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| ownerUid | string | Sim | ID do responsável |

**Exemplo**
```
GET /api/projects?ownerUid=user123
```

**Response 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "project_name": "Projeto 1",
      "created_at": "2024-01-15T10:30:00.000Z",
      ...
    },
    {
      "id": "def456",
      "project_name": "Projeto 2",
      "created_at": "2024-01-14T09:20:00.000Z",
      ...
    }
  ]
}
```

---

#### PUT /projects/:id

Atualiza um projeto existente.

**Parameters**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID do projeto |

**Request Body**
```json
{
  "project_name": "Novo Nome do Projeto"
}
```

**Response 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "project_name": "Novo Nome do Projeto",
    "updated_at": "2024-01-15T11:00:00.000Z",
    ...
  }
}
```

---

#### DELETE /projects/:id

Deleta um projeto.

**Parameters**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID do projeto |

**Response 200 OK**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Project deleted successfully"
  }
}
```

---

### Configurações

#### GET /settings

Busca as configurações globais da aplicação.

**Response 200 OK**
```json
{
  "success": true,
  "data": {
    "rates": {
      "dev_hourly": 120.0,
      "analyst_hourly": 150.0,
      "infra_annual": 5000.0,
      "license_annual": 15000.0
    },
    "baselines": {
      "low": 104,
      "medium": 208,
      "high": 416
    },
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

#### PUT /settings

Atualiza as configurações globais.

**Request Body**
```json
{
  "rates": {
    "dev_hourly": 130.0,
    "analyst_hourly": 160.0,
    "infra_annual": 6000.0,
    "license_annual": 18000.0
  }
}
```

**Response 200 OK**
```json
{
  "success": true,
  "data": {
    "rates": {
      "dev_hourly": 130.0,
      "analyst_hourly": 160.0,
      "infra_annual": 6000.0,
      "license_annual": 18000.0
    },
    "baselines": {
      "low": 104,
      "medium": 208,
      "high": 416
    },
    "updated_at": "2024-01-15T11:30:00.000Z"
  }
}
```

---

## 📊 Lógica de Cálculo

### Matriz de Complexidade

**Pontuação por Critério:**

1. **Número de Aplicações**
   - 1-2: 1 ponto
   - 3-4: 2 pontos
   - 5+: 3 pontos

2. **Tipo de Dados**
   - structured: 1 ponto
   - text: 2 pontos
   - ocr: 5 pontos

3. **Ambiente**
   - web: 1 ponto
   - sap: 2 pontos
   - citrix: 4 pontos

4. **Número de Passos**
   - <20: 1 ponto
   - 20-50: 3 pontos
   - >50: 5 pontos

**Classificação:**
- 4-6 pontos: LOW (80h dev + 24h análise)
- 7-11 pontos: MEDIUM (160h dev + 48h análise)
- 12+ pontos: HIGH (320h dev + 96h análise)

### Fórmulas Financeiras

**Custo AS-IS (Anual)**
```
Custo_Minuto = fteCost / 9600
Custo_AS_IS = (volume × aht × 12) × Custo_Minuto × (1 + errorRate/100)
```

**Custo de Desenvolvimento**
```
Custo_Dev = (devHours × dev_hourly) + (analystHours × analyst_hourly)
```

**Custo TO-BE (Anual)**
```
Custo_TO_BE = license_annual + infra_annual + (Custo_Dev × 0.15)
```

**ROI Ano 1**
```
Economia = Custo_AS_IS - Custo_TO_BE
ROI = ((Economia - Custo_Dev) / Custo_Dev) × 100
```

**Payback (Meses)**
```
Economia_Mensal = Economia / 12
Payback = Custo_Dev / Economia_Mensal
```

---

## 🔍 Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## 📝 Exemplos de Uso

### cURL

```bash
# Criar projeto
curl -X POST https://api.example.com/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Teste",
    "inputs": {
      "volume": 1000,
      "aht": 5,
      "fteCost": 5000
    },
    "complexity": {
      "numApplications": 2,
      "dataType": "structured",
      "environment": "web",
      "numSteps": 15
    }
  }'

# Listar projetos
curl https://api.example.com/api/projects?ownerUid=user123
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com/api',
});

// Criar projeto
const response = await api.post('/projects', {
  projectName: 'Teste',
  inputs: {
    volume: 1000,
    aht: 5,
    fteCost: 5000,
  },
  complexity: {
    numApplications: 2,
    dataType: 'structured',
    environment: 'web',
    numSteps: 15,
  },
});

console.log(response.data);
```

---

## 📄 Licença

Proprietary - Uso Corporativo
