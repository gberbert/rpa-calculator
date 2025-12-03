// frontend/src/components/Home.jsx
import React from 'react';
import {
    Box, Typography, Button, Grid, Paper, Container, Stack, Divider
} from '@mui/material';
import {
    Add, Assessment, History, TrendingUp, Storage
} from '@mui/icons-material';

export default function Home({ onStart }) {
    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5' }}>

            {/* Top Bar / Header */}
            <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', py: 2, px: 4 }}>
                <Container maxWidth="lg">
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Assessment color="primary" sx={{ fontSize: 32 }} />
                            <Box>
                                <Typography variant="h6" color="text.primary" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                                    RPA ROI Calculator
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Enterprise Assessment Tool
                                </Typography>
                            </Box>
                        </Stack>
                        <Box>
                            {/* Placeholder for user profile or settings */}
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={4}>

                    {/* Welcome Section */}
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom fontWeight="500" color="#1a237e">
                            Bem-vindo ao Calculador de ROI
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Ferramenta corporativa para análise de viabilidade financeira e técnica de automações (RPA/IA).
                            Inicie uma nova simulação para gerar o Business Case detalhado.
                        </Typography>
                    </Grid>

                    {/* Action Cards */}
                    <Grid item xs={12} md={8}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'center',
                                gap: 3,
                                bgcolor: '#fff'
                            }}
                        >
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.light',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'primary.main',
                                    flexShrink: 0
                                }}
                            >
                                <Add sx={{ fontSize: 40 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Nova Avaliação
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Inicie um novo cálculo de ROI preenchendo os dados do processo AS-IS,
                                    complexidade técnica e fatores estratégicos.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={onStart}
                                    startIcon={<Add />}
                                    sx={{ px: 4 }}
                                >
                                    Iniciar Simulação
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Stats / Info Side */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <History fontSize="small" /> Recentes
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                                    Nenhuma simulação recente encontrada.
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Features Grid */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
                            Recursos da Ferramenta
                        </Typography>
                        <Grid container spacing={3}>
                            {[
                                {
                                    icon: <TrendingUp />,
                                    title: 'Análise Financeira',
                                    desc: 'Cálculo detalhado de ROI, Payback e VPL.'
                                },
                                {
                                    icon: <Storage />,
                                    title: 'Complexidade Técnica',
                                    desc: 'Matriz de pontuação para esforço de desenvolvimento.'
                                },
                                {
                                    icon: <Assessment />,
                                    title: 'Relatórios',
                                    desc: 'Geração de Business Case em PDF para aprovação.'
                                }
                            ].map((item, index) => (
                                <Grid item xs={12} sm={4} key={index}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #eee' }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {item.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {item.desc}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
}