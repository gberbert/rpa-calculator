import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Função para garantir que só inicializa uma vez
const ensureInitialized = () => {
  if (!admin.apps.length) {
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
        throw new Error("Variáveis de ambiente do Firebase não encontradas.");
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: privateKey,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
      console.log('✅ Firebase Admin initialized successfully (Auto-Start)');
    } catch (error) {
      console.error('❌ Error initializing Firebase Admin:', error.message);
      // Não damos exit aqui para não quebrar testes, mas logamos o erro crítico
    }
  }
};

// Executa a inicialização imediatamente ao importar este arquivo
ensureInitialized();

const initializeFirebase = () => {
  ensureInitialized();
};

const getFirestore = () => {
  ensureInitialized(); // Garante dupla verificação antes de pegar o banco
  return admin.firestore();
};

const db = admin.firestore();
const auth = admin.auth();

export { initializeFirebase, getFirestore, db, auth };