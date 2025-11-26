import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Inicializa o Firebase Admin SDK
 */
const initializeFirebase = () => {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
    process.exit(1);
  }
};

/**
 * Retorna a instância do Firestore
 */
const getFirestore = () => {
  return admin.firestore();
};

export { initializeFirebase, getFirestore };
