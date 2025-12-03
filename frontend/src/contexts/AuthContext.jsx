// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, // <--- Importar isso
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // <--- Importar setDoc
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState('user');
    const [loading, setLoading] = useState(true);

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // NOVA FUNÇÃO: Cadastro
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // Função auxiliar para criar o perfil no banco após o cadastro
    function createUserProfile(user, role = 'user') {
        return setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: role,
            created_at: new Date().toISOString()
        });
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setUserRole(userDoc.data().role || 'user');
                    } else {
                        setUserRole('user');
                    }
                } catch (error) {
                    console.error("Erro ao buscar permissões:", error);
                    setUserRole('user');
                }
            } else {
                setCurrentUser(null);
                setUserRole('user');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        isAdmin: userRole === 'admin',
        login,
        signup, // <--- Exportar
        createUserProfile, // <--- Exportar
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}