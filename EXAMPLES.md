# 📝 Exemplos e Casos de Teste - RPA ROI Navigator

Este documento contém exemplos práticos de uso e casos de teste para validação.

## 🎯 Casos de Uso

### Caso 1: Automação Simples (Complexidade BAIXA)

**Cenário**: Automação de extração de dados de planilhas Excel para sistema web.

**Inputs AS-IS:**
- Volume Mensal: 2.000 transações
- AHT: 5 minutos
- Custo FTE: R$ 6.000/mês
- Taxa de Erro: 2%

**Complexidade:**
- Nº Aplicações: 2 (Excel + Web)
- Tipo de Dados: Estruturados
- Ambiente: Web
- Nº Passos: 15

**Pontuação Esperada**: 1 + 1 + 1 + 1 = 4 pontos → **BAIXA**

**Resultados Esperados:**
- Horas de Desenvolvimento: 80h dev + 24h análise = 104h
- Custo de Desenvolvimento: (80 × R$ 120) + (24 × R$ 150) = R$ 13.200
- Custo AS-IS Anual: (2000 × 5 × 12) × (6000/9600) × 1,02 = R$ 76.500
- Custo TO-BE Anual: R$ 15.000 + R$ 5.000 + (R$ 13.200 × 0,15) = R$ 21.980
- Economia Anual: R$ 76.500 - R$ 21.980 = R$ 54.520
- ROI Ano 1: ((54.520 - 13.200) / 13.200) × 100 = **313%**
- Payback: 13.200 / (54.520/12) = **2,9 meses**

---

### Caso 2: Automação Média (Complexidade MÉDIA)

**Cenário**: Automação de processamento de faturas com validação de dados.

**Inputs AS-IS:**
- Volume Mensal: 5.000 transações
- AHT: 10 minutos
- Custo FTE: R$ 8.000/mês
- Taxa de Erro: 5%

**Complexidade:**
- Nº Aplicações: 3 (ERP + E-mail + Web)
- Tipo de Dados: Estruturados
- Ambiente: Web
- Nº Passos: 25

**Pontuação Esperada**: 2 + 1 + 1 + 3 = 7 pontos → **MÉDIA**

**Resultados Esperados:**
- Horas: 160h dev + 48h análise = 208h
- Custo Dev: (160 × 120) + (48 × 150) = R$ 26.400
- Custo AS-IS: (5000 × 10 × 12) × (8000/9600) × 1,05 = R$ 524.900
- Custo TO-BE: 15.000 + 5.000 + (26.400 × 0,15) = R$ 23.960
- Economia: R$ 524.900 - R$ 23.960 = R$ 500.940
- ROI: ((500.940 - 26.400) / 26.400) × 100 = **1.797%**
- Payback: 26.400 / (500.940/12) = **0,6 meses** (~18 dias)

---

### Caso 3: Automação Complexa (Complexidade ALTA)

**Cenário**: Automação de processamento de documentos com OCR em ambiente Citrix.

**Inputs AS-IS:**
- Volume Mensal: 10.000 transações
- AHT: 15 minutos
- Custo FTE: R$ 10.000/mês
- Taxa de Erro: 8%

**Complexidade:**
- Nº Aplicações: 5+ (Citrix + SAP + OCR + E-mail + Web)
- Tipo de Dados: Imagem/OCR
- Ambiente: Citrix
- Nº Passos: 60

**Pontuação Esperada**: 3 + 5 + 4 + 5 = 17 pontos → **ALTA**

**Resultados Esperados:**
- Horas: 320h dev + 96h análise = 416h
- Custo Dev: (320 × 120) + (96 × 150) = R$ 52.800
- Custo AS-IS: (10000 × 15 × 12) × (10000/9600) × 1,08 = R$ 2.025.000
- Custo TO-BE: 15.000 + 5.000 + (52.800 × 0,15) = R$ 27.920
- Economia: R$ 2.025.000 - R$ 27.920 = R$ 1.997.080
- ROI: ((1.997.080 - 52.800) / 52.800) × 100 = **3.682%**
- Payback: 52.800 / (1.997.080/12) = **0,3 meses** (~9 dias)

---

### Caso 4: Cenário com ROI Negativo

**Cenário**: Automação de processo com volume muito baixo.

**Inputs AS-IS:**
- Volume Mensal: 100 transações
- AHT: 30 minutos
- Custo FTE: R$ 5.000/mês
- Taxa de Erro: 0%

**Complexidade:**
- Nº Aplicações: 4
- Tipo de Dados: Texto
- Ambiente: SAP
- Nº Passos: 40

**Pontuação Esperada**: 2 + 2 + 2 + 3 = 9 pontos → **MÉDIA**

**Resultados Esperados:**
- Custo Dev: R$ 26.400
- Custo AS-IS: (100 × 30 × 12) × (5000/9600) × 1,0 = R$ 18.750
- Custo TO-BE: R$ 23.960
- Economia: R$ 18.750 - R$ 23.960 = **-R$ 5.210** (custo maior!)
- ROI: ((-5.210 - 26.400) / 26.400) × 100 = **-119%** (prejuízo)
- Payback: **Nunca** (economia negativa)

**Conclusão**: Automação não é viável economicamente.

---

## 🧪 Testes de API

### Teste 1: Health Check

```bash
curl http://localhost:5000/api/health
```

**Resposta Esperada:**
```json
{
  "success": true,
  "message": "RPA ROI Navigator API is running",
  "timestamp": "2024-01-15T..."
}
```

---

### Teste 2: Criar Projeto (Caso Médio)

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Teste - Automação Média",
    "ownerUid": "test_user",
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
  }'
```

**Validações:**
- Status: 201 Created
- `complexity_score.classification`: "MEDIUM"
- `complexity_score.total_points`: 7
- `results.roi_year_1`: ~1797%
- `results.payback_months`: ~0.6

---

### Teste 3: Buscar Configurações

```bash
curl http://localhost:5000/api/settings
```

**Resposta Esperada:**
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
    }
  }
}
```

---

### Teste 4: Listar Projetos

```bash
curl "http://localhost:5000/api/projects?ownerUid=test_user"
```

**Validações:**
- Status: 200 OK
- Array de projetos
- Ordenado por `created_at` (desc)

---

### Teste 5: Validação de Erro (Campos Faltando)

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Teste Incompleto"
  }'
```

**Resposta Esperada:**
```json
{
  "success": false,
  "error": "Missing required fields: projectName, inputs, complexity"
}
```

Status: 400 Bad Request

---

## 🎨 Testes de Frontend

### Teste 1: Wizard - Validação de Step 1

1. Acesse `http://localhost:5173`
2. Deixe o campo "Nome do Projeto" vazio
3. Tente clicar em "Próximo"
4. **Esperado**: Botão desabilitado

### Teste 2: Wizard - Validação de Step 2

1. Preencha Step 1 e avance
2. No Step 2, insira valores inválidos (negativos ou zero)
3. **Esperado**: Botão "Próximo" desabilitado

### Teste 3: Wizard - Cálculo Completo

1. Preencha todos os steps com dados válidos
2. Clique em "Calcular ROI"
3. **Esperado**: 
   - Loading spinner aparece
   - Após 1-2s, dashboard de resultados é exibido
   - KPIs estão visíveis
   - Gráficos são renderizados

### Teste 4: Dashboard - Visualização de Gráficos

1. Após calcular ROI, verifique:
   - Gráfico de barras (AS-IS vs TO-BE)
   - Gráfico de pizza (Breakdown TO-BE)
   - Gráfico de linha (Projeção Payback)
2. **Esperado**: Todos os gráficos renderizados corretamente

### Teste 5: Dashboard - Nova Simulação

1. No dashboard, clique em "Nova Simulação"
2. **Esperado**: Retorna ao wizard com formulário limpo

---

## 🔍 Testes de Integração

### Teste E2E Completo

**Pré-condições:**
- Backend rodando em `localhost:5000`
- Frontend rodando em `localhost:5173`
- Firestore inicializado

**Passos:**

1. **Abrir aplicação**
   - Acesse `http://localhost:5173`
   - Verifique que o wizard é exibido

2. **Step 1: Informações**
   - Nome: "Teste E2E - Automação de Faturamento"
   - Responsável: "João Silva"
   - Clique em "Próximo"

3. **Step 2: AS-IS**
   - Volume: 5000
   - AHT: 10
   - Custo FTE: 8000
   - Taxa de Erro: 5% (slider)
   - Clique em "Próximo"

4. **Step 3: Complexidade**
   - Nº Aplicações: 3
   - Tipo de Dados: Estruturados
   - Ambiente: Web/Local
   - Nº Passos: 25
   - Verifique chip: "Complexidade: MÉDIA"
   - Clique em "Próximo"

5. **Step 4: Revisão**
   - Verifique todos os dados exibidos
   - Clique em "Calcular ROI"

6. **Resultados**
   - Aguarde loading
   - Verifique KPIs:
     - ROI ~1797%
     - Economia ~R$ 500k
     - Payback ~0.6 meses
     - Complexidade: MÉDIA
   - Verifique gráficos renderizados
   - Clique em "Nova Simulação"

7. **Validação Final**
   - Formulário deve estar limpo
   - Pronto para nova simulação

**Resultado Esperado**: Todos os passos executados sem erros.

---

## 📊 Matriz de Testes de Complexidade

| Apps | Dados | Ambiente | Passos | Pontos | Classificação |
|------|-------|----------|--------|--------|---------------|
| 1 | structured | web | 10 | 4 | BAIXA |
| 2 | structured | web | 15 | 4 | BAIXA |
| 3 | structured | web | 25 | 7 | MÉDIA |
| 4 | text | sap | 30 | 9 | MÉDIA |
| 5 | text | citrix | 40 | 13 | ALTA |
| 6 | ocr | citrix | 60 | 17 | ALTA |
| 2 | ocr | web | 15 | 8 | MÉDIA |
| 3 | text | web | 55 | 11 | MÉDIA |

---

## ✅ Checklist de Validação

### Backend
- [ ] Health check responde corretamente
- [ ] Criar projeto retorna 201
- [ ] Validação de campos obrigatórios funciona
- [ ] Cálculo de complexidade está correto
- [ ] Fórmulas financeiras retornam valores esperados
- [ ] Firestore salva dados corretamente
- [ ] CORS permite origem do frontend

### Frontend
- [ ] Wizard renderiza todos os 4 steps
- [ ] Validação de campos funciona
- [ ] Botões habilitam/desabilitam corretamente
- [ ] Loading state aparece durante cálculo
- [ ] Dashboard exibe todos os KPIs
- [ ] Gráficos renderizam corretamente
- [ ] "Nova Simulação" limpa o formulário
- [ ] Responsivo em mobile

### Integração
- [ ] Frontend se comunica com backend
- [ ] Dados são salvos no Firestore
- [ ] Configurações globais são carregadas
- [ ] Erros são tratados adequadamente

---

## 🐛 Casos de Erro Conhecidos

### 1. CORS Error
**Sintoma**: `Access to XMLHttpRequest has been blocked by CORS policy`
**Causa**: Frontend não está em `ALLOWED_ORIGINS`
**Solução**: Adicionar URL do frontend no `.env` do backend

### 2. Firebase Permission Denied
**Sintoma**: `Missing or insufficient permissions`
**Causa**: Regras de segurança muito restritivas
**Solução**: Ajustar regras no Console do Firebase

### 3. Cálculo com Volume Zero
**Sintoma**: ROI infinito ou NaN
**Causa**: Divisão por zero
**Solução**: Validação no frontend impede volume = 0

---

## 📄 Licença

Proprietary - Uso Corporativo
