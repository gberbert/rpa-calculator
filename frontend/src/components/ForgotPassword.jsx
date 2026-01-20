// frontend/src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert, Link, Grid, IconButton, Tooltip, InputAdornment, OutlinedInput } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { userService } from '../services/api';

export default function ForgotPassword({ onBack }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [tempPassword, setTempPassword] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setTempPassword(null);

        try {
            const response = await userService.resetPassword(email);
            // Em DEV, mostramos a senha temporária. Em PROD, apenas avisamos.
            if (response.tempPassword) {
                setTempPassword(response.tempPassword);
                setMessage({
                    type: 'success',
                    text: `Senha resetada com sucesso! Sua conta foi bloqueada por segurança. Contate o administrador para desbloqueio.`
                });
            } else {
                setMessage({
                    type: 'success',
                    text: 'Se o email existir, uma nova senha foi gerada e sua conta bloqueada por segurança. Contate o administrador.'
                });
            }
        } catch (error) {
            console.error("Erro no reset:", error);
            setMessage({ type: 'error', text: 'Erro ao processar solicitação. Verifique o email.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCopyPassword = () => {
        if (tempPassword) {
            navigator.clipboard.writeText(tempPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" sx={{ mb: 3, color: '#1a237e', fontWeight: 'bold' }}>
                        Recuperar Senha
                    </Typography>

                    {message && <Alert severity={message.type} sx={{ width: '100%', mb: 2 }}>{message.text}</Alert>}

                    {tempPassword && (
                        <Box sx={{ width: '100%', mb: 3, p: 2, bgcolor: '#e8f5e9', borderRadius: 1, border: '1px dashed #66bb6a' }}>
                            <Typography variant="subtitle2" color="success.main" gutterBottom fontWeight="bold">
                                Sua Senha Temporária:
                            </Typography>
                            <OutlinedInput
                                fullWidth
                                value={tempPassword}
                                readOnly
                                sx={{ bgcolor: 'white', fontFamily: 'monospace', fontWeight: 'bold' }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Tooltip title={copied ? "Copiado!" : "Copiar Senha"}>
                                            <IconButton onClick={handleCopyPassword} edge="end">
                                                {copied ? <Check color="success" /> : <ContentCopy />}
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                }
                            />
                            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                                Copie esta senha e solicite o desbloqueio ao administrador.
                            </Typography>
                        </Box>
                    )}

                    {!tempPassword && (
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Cadastrado"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, bgcolor: '#1a237e' }}
                                disabled={loading}
                            >
                                {loading ? 'Processando...' : 'Resetar Senha'}
                            </Button>
                        </Box>
                    )}

                    <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Grid item>
                            <Link component="button" variant="body2" onClick={onBack}>
                                Voltar para Login
                            </Link>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
}
