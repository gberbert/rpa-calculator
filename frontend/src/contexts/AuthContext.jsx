// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // Função auxiliar para criar o perfil no banco após o cadastro
    function createUserProfile(user, role = 'user') {
        return setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: role,
            isBlocked: true, // [SECURITY] Default to blocked for new users
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
                        const data = userDoc.data();

                        // [SECURITY] Check if blocked
                        if (data.isBlocked) {
                            console.warn(`[Auth] User ${user.email} is blocked.`);
                            await logout();
                            alert("Sua conta está bloqueada ou aguardando aprovação. Entre em contato com o administrador.");
                            return;
                        }

                        const role = data.role || 'user';
                        console.log(`[Auth] Carregado perfil do banco para ${user.email}: ${role}`);
                        setUserRole(role);
                    } else {
                        // Fallback: Se não existe no banco, mas tem email de admin, assume admin temporariamente
                        if (user.email && user.email.toLowerCase().startsWith('admin')) {
                            console.log(`[Auth] Perfil não encontrado, mas email 'admin' detectado. Elevando privilégios.`);
                            setUserRole('admin');
                        } else {
                            setUserRole('user');
                        }
                    }
                } catch (error) {
                    console.error("Erro ao buscar permissões:", error);
                    // Fallback de erro também
                    if (user.email && user.email.toLowerCase().startsWith('admin')) {
                        setUserRole('admin');
                    } else {
                        setUserRole('user');
                    }
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
        signup,
        createUserProfile,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}