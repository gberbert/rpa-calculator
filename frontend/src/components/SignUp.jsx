// frontend/src/components/SignUp.jsx
import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function SignUp({ onSwitchToLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { signup, createUserProfile } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        // 1. Validação de Senha Iguais
        if (password !== confirmPassword) {
            return setError('As senhas não coincidem.');
        }

        // 2. Validação de Regras Básicas
        if (password.length < 6) {
            return setError('A senha deve ter pelo menos 6 caracteres.');
        }

        try {
            setError('');
            setLoading(true);
            
            // Criar usuário no Auth
            const userCredential = await signup(email, password);
            
            // Criar perfil no Firestore
            await createUserProfile(userCredential.user);
            
            // O App.jsx vai detectar o login automaticamente
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Este e-mail já está cadastrado.');
            } else if (err.code === 'auth/weak-password') {
                setError('A senha é muito fraca.');
            } else {
                setError('Falha ao criar conta. Tente novamente.');
            }
        }

        setLoading(false);
    }

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <Box sx={{ bgcolor: 'secondary.main', color: 'white', p: 2, borderRadius: '50%', mb: 2 }}>
                    <PersonAdd fontSize="large" />
                </Box>
                <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                    Criar Conta
                </Typography>
                
                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal" required fullWidth
                        label="Email Corporativo" type="email"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal" required fullWidth
                        label="Senha" type="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        helperText="Mínimo de 6 caracteres"
                    />
                    <TextField
                        margin="normal" required fullWidth
                        label="Confirmar Senha" type="password"
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    
                    <Button
                        type="submit" fullWidth variant="contained" color="secondary"
                        sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                        disabled={loading}
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2">
                            Já tem uma conta?{' '}
                            <Link component="button" variant="body2" onClick={onSwitchToLogin}>
                                Fazer Login
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}