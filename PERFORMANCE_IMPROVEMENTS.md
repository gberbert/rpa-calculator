# Melhorias de Performance Implementadas

Este documento detalha as otimizações realizadas no backend para resolver os problemas de lentidão relatados no Wizard de cálculo e no Histórico de Projetos.

## 1. Otimização do Histórico de Projetos (`projectService.js`)

**Problema:**
Anteriormente, o sistema buscava **todos** os projetos do banco de dados e realizava a ordenação via código (JavaScript). Isso causava lentidão extrema à medida que o número de registros crescia (complexidade O(N) e alto uso de memória).

**Solução:**
Implementamos paginação e ordenação diretamente no banco de dados (Firestore).
- **Server-Side Sorting:** Agora utilizamos `.orderBy('created_at', 'desc')` para trazer os mais recentes primeiro.
- **Limitação de Registros:** Adicionamos `.limit(50)` para buscar apenas os 50 últimos projetos inicialmente, reduzindo drasticamente o tráfego de rede e tempo de processamento.
- **Fallback Inteligente:** Se o índice necessário não existir no Firestore, o sistema detecta o erro e automaticamente reverte para o método antigo (ordenação em memória) para não quebrar a aplicação.

### ⚠️ Ação Necessária (Para Performance Máxima)
Para que a ordenação no banco de dados funcione para filtros por usuário, você precisa criar um **Índice Composto** no Firestore.

Se você verificar os logs do backend, verá um link gerado pelo Firebase quando a consulta falhar. Clique nele ou crie manualmente:
- **Collection ID:** `projects`
- **Fields:**
  - `owner_uid` (Ascending ou Descending)
  - `created_at` (Descending)

## 2. Otimização do Cálculo de ROI (`calculationService.js`)

**Problema:**
A cada cálculo de ROI (clique em "Calcular" no Wizard), o backend fazia uma leitura no banco de dados para buscar as taxas globais (`global_config`). Isso adicionava latência desnecessária, especialmente se o banco estivesse ocupado.

**Solução:**
Implementamos um sistema de **Cache em Memória**.
- As taxas globais agora são armazenadas na memória do servidor por **5 minutos**.
- As requisições subsequentes dentro desse período são instantâneas, pois não acessam o banco de dados.

## Resumo
- **Wizard:** O cálculo deve ser muito mais rápido devido ao cache das configurações.
- **Histórico:** O carregamento deve ser quase instantâneo para os 50 últimos projetos.

## Próximos Passos Sugeridos
1. Criar o índice no Firestore (conforme descrito acima).
2. Se necessário, implementar paginação real ("Carregar Mais") no frontend para ver projetos além dos 50 últimos.
