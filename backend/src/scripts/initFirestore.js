// backend/src/scripts/initFirestore.js
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const initializeFirestore = async () => {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: privateKey,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                }),
            });
        }
        
        const db = admin.firestore();
        console.log('🔥 Atualizando Firestore com estrutura Enterprise...');

        // Nova Configuração Global "Enterprise"
        const globalConfig = {
            // Definição da Squad e Custo Ponderado
            team_composition: [
                { role: 'Desenvolvedor RPA', rate: 120.0, share: 0.60 }, // 60% do tempo
                { role: 'Analista de Negócios', rate: 150.0, share: 0.20 }, // 20% do tempo
                { role: 'Arquiteto de Soluções', rate: 190.0, share: 0.10 }, // 10% do tempo
                { role: 'Gerente de Projetos (GP)', rate: 170.0, share: 0.10 } // 10% do tempo
            ],
            infra_costs: {
                virtual_machine_annual: 5000.0,
                rpa_license_annual: 15000.0,
                database_annual: 2000.0
            },
            baselines: {
                low: 100,    // Horas totais do projeto
                medium: 240,
                high: 480
            },
            updated_at: new Date().toISOString(),
        };

        await db.collection('settings').doc('global_config').set(globalConfig);
        console.log('✅ Configurações Enterprise aplicadas com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
};

initializeFirestore();