// backend/src/scripts/setAdmin.js
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

// Inicialização do Firebase (igual ao initFirestore, mas focado no Auth)
const initializeApp = () => {
    if (!admin.apps.length) {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: privateKey,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        });
    }
    return admin.firestore();
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const setAdmin = async () => {
    const db = initializeApp();
    const auth = admin.auth();

    console.log('\n👑 --- RPA ROI Navigator: Configurar Administrador ---\n');

    rl.question('Digite o EMAIL do usuário que será ADMIN: ', async (email) => {
        try {
            // 1. Achar o usuário no Auth para pegar o UID
            console.log(`🔍 Buscando usuário ${email}...`);
            const userRecord = await auth.getUserByEmail(email);
            const uid = userRecord.uid;

            console.log(`✅ Usuário encontrado! UID: ${uid}`);

            // 2. Criar ou atualizar o documento na coleção 'users' com a role 'admin'
            // Usamos merge: true para não apagar outros dados se existirem
            await db.collection('users').doc(uid).set({
                email: email,
                role: 'admin',
                updated_at: new Date().toISOString()
            }, { merge: true });

            console.log(`🎉 SUCESSO! O usuário ${email} agora é um ADMINISTRADOR.`);
            console.log('Ele terá acesso ao menu "Configurações" no próximo login.\n');

        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                console.error('❌ Erro: Usuário não encontrado no Firebase Auth. Crie a conta primeiro via App.');
            } else {
                console.error('❌ Erro inesperado:', error.message);
            }
        } finally {
            rl.close();
            process.exit(0);
        }
    });
};

setAdmin();