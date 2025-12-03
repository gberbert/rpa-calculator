// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

// Recebemos a função onSwitchToRegister via props para alternar telas
export default function Login({ onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            // O redirecionamento acontece automaticamente pelo AuthContext no App.jsx
        } catch (err) {
            console.error(err);
            setError('Falha no login. Verifique email e senha.');
        }
        setLoading(false);
    }

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                
                {/* LOGO DA EMPRESA NO LOGIN */}
                <Box 
                    component="img"
                    src="/logo.png"
                    alt="Logo"
                    sx={{ 
                        height: 80, // Tamanho maior para destaque
                        width: 'auto',
                        mb: 3,
                        objectFit: 'contain'
                    }}
                />

                <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                    RPA ROI Navigator
                </Typography>
                
                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal" required fullWidth
                        label="Email Corporativo" autoFocus
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal" required fullWidth
                        label="Senha" type="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit" fullWidth variant="contained"
                        sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2">
                            Não tem uma conta?{' '}
                            <Link component="button" variant="body2" onClick={onSwitchToRegister}>
                                Cadastre-se
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}