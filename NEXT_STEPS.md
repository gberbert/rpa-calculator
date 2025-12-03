# 🚀 Próximos Passos - RPA ROI Navigator

Parabéns! O projeto **RPA ROI Navigator** foi criado com sucesso. Este guia mostrará os próximos passos para colocar a aplicação em funcionamento.

## 📋 Status Atual

✅ **Estrutura do projeto criada**  
✅ **Backend implementado** (Node.js + Express + Firebase)  
✅ **Frontend implementado** (React + Material UI + PWA)  
✅ **Documentação completa**  
✅ **Pronto para desenvolvimento local**

## 🎯 Próximos Passos Imediatos

### 1. Configurar o Firebase (15 minutos)

#### a) Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Nome do projeto: `rpa-roi-navigator` (ou outro de sua escolha)
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar projeto"

#### b) Habilitar Firestore

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha **"Iniciar no modo de produção"**
4. Selecione a região: **southamerica-east1** (São Paulo)
5. Clique em "Ativar"

#### c) Obter Credenciais Admin SDK

1. Clique no ícone de engrenagem ⚙️ → "Configurações do projeto"
2. Vá para a aba "Contas de serviço"
3. Clique em "Gerar nova chave privada"
4. Salve o arquivo JSON baixado (você precisará dele)

#### d) Obter Credenciais Client SDK

1. Na mesma tela de configurações
2. Role até "Seus aplicativos"
3. Clique no ícone Web `</>`
4. Registre o app: `RPA ROI Navigator Frontend`
5. Copie as configurações do Firebase (você precisará delas)

### 2. Instalar Dependências do Backend (5 minutos)

```bash
cd backend
npm install
```

### 3. Configurar Variáveis de Ambiente do Backend

Crie o arquivo `backend/.env` (copie de `.env.example`):

```bash
cd backend
cp .env.example .env
```

Edite `backend/.env` com os dados do Firebase:

```env
PORT=5000
NODE_ENV=development

# Dados do arquivo JSON baixado (Admin SDK)
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nCole-a-chave-privada-aqui\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com

ALLOWED_ORIGINS=http://localhost:5173
```

**⚠️ IMPORTANTE**: 
- Mantenha os `\n` na `FIREBASE_PRIVATE_KEY`
- Use aspas duplas ao redor da chave

### 4. Inicializar o Firestore com Dados Padrão

```bash
cd backend
node src/scripts/initFirestore.js
```

Você verá:
```
🔥 Inicializando Firestore...
✅ Configurações globais criadas
✅ Projeto de exemplo criado
🎉 Firestore inicializado com sucesso!
```

### 5. Iniciar o Backend

```bash
cd backend
npm run dev
```

Você verá:
```
✅ Firebase Admin initialized successfully
🚀 Server running on port 5000
📍 Environment: development
🌐 CORS enabled for: http://localhost:5173
```

**Teste**: Abra `http://localhost:5000/api/health` no navegador.

### 6. Instalar Dependências do Frontend (5 minutos)

Abra um **novo terminal**:

```bash
cd frontend
npm install
```

### 7. Configurar Variáveis de Ambiente do Frontend

Crie o arquivo `frontend/.env`:

```bash
cd frontend
cp .env.example .env
```

Edite `frontend/.env` com os dados do Firebase Client SDK:

```env
VITE_API_URL=http://localhost:5000

# Dados obtidos no passo 1d (Client SDK)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 8. Iniciar o Frontend

```bash
cd frontend
npm run dev
```

Você verá:
```
VITE v5.1.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 🚀 Opção Rápida: Iniciar Tudo (Novo)

Agora você pode iniciar o Backend e Frontend simultaneamente com um único comando na raiz do projeto:

```bash
# Na raiz do projeto (rpa-calculator)
npm run dev
```

Isso iniciará ambos os servidores em paralelo.
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### 9. Testar a Aplicação

1. Abra `http://localhost:5173` no navegador
2. Você verá o wizard de cálculo de ROI
3. Preencha um projeto de teste:
   - **Nome**: "Teste - Automação de Faturamento"
   - **Volume**: 5000
   - **AHT**: 10
   - **Custo FTE**: 8000
   - **Taxa de Erro**: 5%
   - **Nº Aplicações**: 3
   - **Tipo de Dados**: Estruturados
   - **Ambiente**: Web
   - **Nº Passos**: 25
4. Clique em "Calcular ROI"
5. Visualize o dashboard com os resultados

**✅ Se tudo funcionou, parabéns! A aplicação está rodando localmente.**

## 🔍 Verificação de Problemas

### Backend não inicia

**Erro**: `Firebase Admin initialization failed`

**Solução**:
1. Verifique se o arquivo `.env` está na pasta `backend/`
2. Confirme que a `FIREBASE_PRIVATE_KEY` está correta
3. Certifique-se de manter os `\n` na string

### CORS Error

**Erro**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solução**:
1. Verifique se `ALLOWED_ORIGINS` no backend inclui `http://localhost:5173`
2. Reinicie o backend após alterar o `.env`

### Frontend não carrega

**Erro**: `Failed to fetch` ou erro de rede

**Solução**:
1. Confirme que o backend está rodando em `http://localhost:5000`
2. Teste `http://localhost:5000/api/health` no navegador
3. Verifique se `VITE_API_URL` no frontend está correto

## 📚 Próximos Passos Opcionais

### Customização

- [ ] Ajustar taxas padrão no Firestore (coleção `settings`)
- [ ] Personalizar cores do tema em `frontend/src/App.jsx`
- [ ] Adicionar logo da empresa
- [ ] Traduzir textos se necessário

### Desenvolvimento

- [ ] Explorar o código em `backend/src/services/calculationService.js`
- [ ] Entender a lógica de cálculo
- [ ] Modificar fórmulas se necessário
- [ ] Adicionar novos campos ao formulário

### Testes

- [ ] Testar diferentes cenários (ver `EXAMPLES.md`)
- [ ] Validar cálculos com dados reais
- [ ] Testar em diferentes navegadores
- [ ] Testar responsividade mobile

### Deploy

- [ ] Seguir o guia em `DEPLOY.md`
- [ ] Configurar Render (backend e frontend)
- [ ] Configurar domínio personalizado
- [ ] Configurar SSL/HTTPS

## 📖 Documentação de Referência

| Documento | Quando Usar |
|-----------|-------------|
| [QUICKSTART.md](QUICKSTART.md) | Setup inicial rápido |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Entender a arquitetura |
| [API.md](API.md) | Integrar com a API |
| [DEPLOY.md](DEPLOY.md) | Deploy em produção |
| [EXAMPLES.md](EXAMPLES.md) | Casos de uso e testes |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Estrutura de arquivos |

## 🆘 Precisa de Ajuda?

### Recursos

1. **Documentação do Projeto**: Leia os arquivos `.md` na raiz
2. **Firebase Docs**: https://firebase.google.com/docs
3. **React Docs**: https://react.dev
4. **Material UI Docs**: https://mui.com
5. **Vite Docs**: https://vitejs.dev

### Checklist de Troubleshooting

- [ ] Backend está rodando?
- [ ] Frontend está rodando?
- [ ] Firestore foi inicializado?
- [ ] Variáveis de ambiente estão corretas?
- [ ] Credenciais do Firebase estão válidas?
- [ ] CORS está configurado corretamente?

## 🎉 Conclusão

Você agora tem uma aplicação completa de cálculo de ROI para automações RPA!

### O que você pode fazer agora:

✅ Criar simulações de ROI  
✅ Visualizar resultados em dashboard  
✅ Salvar projetos no Firestore  
✅ Customizar a aplicação  
✅ Preparar para deploy em produção  

### Próximos Marcos:

1. ✅ **Desenvolvimento Local** ← Você está aqui
2. ⏳ **Testes e Validação**
3. ⏳ **Deploy em Produção**
4. ⏳ **Treinamento de Usuários**
5. ⏳ **Feedback e Melhorias**

---

**Boa sorte com o projeto! 🚀**

Se tiver dúvidas, consulte a documentação ou revise os arquivos de código.

**Versão**: 1.0.0  
**Data**: 2024-01-15
