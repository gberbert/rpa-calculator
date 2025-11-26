import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script para inicializar o Firestore com configurações padrão
 */

const initializeFirestore = async () => {
    try {
        // Inicializar Firebase Admin
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: privateKey,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        });

        const db = admin.firestore();

        console.log('🔥 Inicializando Firestore...\n');

        // Configurações globais padrão
        const globalConfig = {
            rates: {
                dev_hourly: 120.0,
                analyst_hourly: 150.0,
                infra_annual: 5000.0,
                license_annual: 15000.0,
            },
            baselines: {
                low: 104,
                medium: 208,
                high: 416,
            },
            updated_at: new Date().toISOString(),
        };

        // Criar/atualizar documento de configurações
        await db.collection('settings').doc('global_config').set(globalConfig);

        console.log('✅ Configurações globais criadas:');
        console.log(JSON.stringify(globalConfig, null, 2));
        console.log('\n');

        // Criar projeto de exemplo
        const exampleProject = {
            project_name: 'Exemplo - Automação de Faturamento',
            owner_uid: 'demo_user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            inputs_as_is: {
                volume: 5000,
                aht: 10,
                fte_cost: 8000,
                error_rate: 5,
            },
            complexity_input: {
                numApplications: 3,
                dataType: 'structured',
                environment: 'web',
                numSteps: 25,
            },
            complexity_score: {
                total_points: 8,
                classification: 'MEDIUM',
                hours: {
                    devHours: 160,
                    analystHours: 48,
                    totalHours: 208,
                },
            },
            results: {
                development_cost: 26400,
                as_is_cost_annual: 500000,
                to_be_cost_annual: 24960,
                roi_year_1: 1699.24,
                annual_savings: 475040,
                monthly_savings: 39586.67,
                payback_months: 0.7,
                cost_breakdown: {
                    licenseCost: 15000,
                    infraCost: 5000,
                    maintenanceCost: 3960,
                    exceptionCost: 0,
                    totalToBeCost: 23960,
                },
            },
        };

        const projectRef = await db.collection('projects').add(exampleProject);

        console.log('✅ Projeto de exemplo criado:');
        console.log(`   ID: ${projectRef.id}`);
        console.log(`   Nome: ${exampleProject.project_name}`);
        console.log(`   ROI Ano 1: ${exampleProject.results.roi_year_1}%`);
        console.log(`   Payback: ${exampleProject.results.payback_months} meses`);
        console.log('\n');

        console.log('🎉 Firestore inicializado com sucesso!\n');
        console.log('📊 Coleções criadas:');
        console.log('   - settings (1 documento)');
        console.log('   - projects (1 documento de exemplo)');
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao inicializar Firestore:', error);
        process.exit(1);
    }
};

initializeFirestore();
