import { db, auth } from '../config/firebase.js';

class UserController {
    // Listar todos os usuários (com dados do Auth e Firestore)
    async listUsers(req, res) {
        try {
            // 1. Buscar usuários do Firebase Auth
            const listUsersResult = await auth.listUsers(1000); // Limite de 1000 por enquanto
            const authUsers = listUsersResult.users;

            // 2. Buscar perfis do Firestore
            const usersSnapshot = await db.collection('users').get();
            const firestoreProfiles = {};
            usersSnapshot.forEach(doc => {
                firestoreProfiles[doc.id] = doc.data();
            });

            // 3. Mesclar dados
            const users = authUsers.map(user => {
                const profile = firestoreProfiles[user.uid] || {};
                return {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || profile.displayName || 'Sem Nome',
                    role: profile.role || 'user',
                    isBlocked: profile.isBlocked === true, // Default false
                    lastSignInTime: user.metadata.lastSignInTime,
                    creationTime: user.metadata.creationTime
                };
            });

            res.status(200).json(users);
        } catch (error) {
            console.error('Error listing users:', error);
            res.status(500).json({ error: 'Failed to list users' });
        }
    }

    // Bloquear/Desbloquear usuário
    async toggleBlockStatus(req, res) {
        const { uid } = req.params;
        const { isBlocked } = req.body;

        try {
            // Atualizar no Firestore
            await db.collection('users').doc(uid).set({
                isBlocked: isBlocked
            }, { merge: true });

            // Opcional: Desabilitar no Auth também para garantir
            await auth.updateUser(uid, {
                disabled: isBlocked
            });

            res.status(200).json({
                success: true,
                message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`
            });
        } catch (error) {
            console.error('Error updating user status:', error);
            res.status(500).json({ error: 'Failed to update user status' });
        }
    }

    // Resetar senha e bloquear (Fluxo "Esqueci Senha")
    async resetPasswordAndBlock(req, res) {
        const { email } = req.body;

        try {
            const userRecord = await auth.getUserByEmail(email);
            const uid = userRecord.uid;

            // 1. Gerar senha temporária
            const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            // 2. Atualizar senha no Auth
            await auth.updateUser(uid, {
                password: tempPassword,
                disabled: true // Bloqueia imediatamente no Auth
            });

            // 3. Marcar como bloqueado no Firestore
            await db.collection('users').doc(uid).set({
                isBlocked: true,
                tempPasswordGeneratedAt: new Date().toISOString()
            }, { merge: true });

            // 4. Retornar a senha (em PROD enviaria por email)
            // AVISO: Retornando no corpo apenas para este ambiente de DEV/DEMO
            res.status(200).json({
                success: true,
                message: 'Password reset and user blocked. Admin approval required.',
                tempPassword: tempPassword // TODO: Remover em produção real e enviar por email
            });

        } catch (error) {
            console.error('Error resetting password:', error);
            if (error.code === 'auth/user-not-found') {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(500).json({ error: 'Failed to reset password' });
        }
    }
}

export default new UserController();
