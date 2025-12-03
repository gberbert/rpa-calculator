import admin from 'firebase-admin';
import dotenv from 'dotenv';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configuração de caminhos para ler o .env corretamente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../../.env');

dotenv.config({ path: envPath });

async function createIndex() {
    console.log('🚀 Iniciando criação automática de índice no Firestore...');

    // 1. Inicializar Firebase Admin para obter credenciais
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
        console.error('❌ Erro: Variáveis de ambiente do Firebase não encontradas no arquivo .env');
        process.exit(1);
    }

    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    // Inicializa app temporário se não existir
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: privateKey,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        });
    }

    try {
        // 2. Obter Access Token OAuth2
        console.log('🔑 Obtendo token de acesso...');
        // Usa a credencial explicitamente configurada na inicialização do app
        const accessTokenObj = await admin.app().options.credential.getAccessToken();
        const accessToken = accessTokenObj.access_token;

        // 3. Definir o Índice
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const collectionGroup = 'projects';

        const indexDefinition = {
            queryScope: "COLLECTION",
            fields: [
                { fieldPath: "owner_uid", order: "ASCENDING" },
                { fieldPath: "created_at", order: "DESCENDING" }
            ]
        };

        // 4. Enviar requisição para Firestore Admin API
        console.log(`📡 Enviando requisição para criar índice em '${collectionGroup}'...`);

        const options = {
            hostname: 'firestore.googleapis.com',
            path: `/v1/projects/${projectId}/databases/(default)/collectionGroups/${collectionGroup}/indexes`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    const response = JSON.parse(data);
                    console.log('✅ Índice criado com sucesso!');
                    console.log('🆔 Operation ID:', response.name);
                    console.log('⏳ O índice está sendo construído. Isso pode levar alguns minutos.');
                    console.log('👉 Você pode verificar o status no console do Firebase.');
                } else if (res.statusCode === 409) {
                    console.log('⚠️ O índice já existe ou está sendo criado (Conflict).');
                } else {
                    console.error(`❌ Erro na API (${res.statusCode}):`, data);
                }
            });
        });

        req.on('error', (e) => {
            console.error('❌ Erro na requisição:', e);
        });

        req.write(JSON.stringify(indexDefinition));
        req.end();

    } catch (error) {
        console.error('❌ Erro inesperado:', error);
    }
}

createIndex();
