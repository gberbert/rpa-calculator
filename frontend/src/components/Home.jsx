// frontend/src/components/Home.jsx
import React from 'react';
import { 
    Box, Typography, Button, Grid, Paper, Container, Stack, Chip
} from '@mui/material';
import { 
    RocketLaunch, Assessment, CheckCircle, TrendingUp, Speed, Security 
} from '@mui/icons-material';

export default function Home({ onStart }) {
    return (
        <Box sx={{ width: '100%', overflowX: 'hidden', bgcolor: '#f4f6f8' }}>
            
            {/* HERO SECTION (Área Azul) */}
            <Box 
                sx={{ 
                    background: 'linear-gradient(180deg, #172554 0%, #1e3a8a 100%)', // Azul Profundo
                    pt: { xs: 6, md: 12 }, // Padding topo responsivo
                    pb: { xs: 12, md: 20 }, // Padding base grande para o overlap
                    position: 'relative',
                    clipPath: { xs: 'none', md: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' } // Corte diagonal sutil no desktop
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        
                        {/* COLUNA 1: Texto e CTA */}
                        <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography 
                                variant="overline" 
                                sx={{ 
                                    color: '#90caf9', 
                                    letterSpacing: 3, 
                                    fontWeight: 'bold',
                                    display: 'block',
                                    mb: 2
                                }}
                            >
                                RPA ROI NAVIGATOR
                            </Typography>

                            <Typography 
                                component="h1" 
                                sx={{ 
                                    color: 'white',
                                    fontWeight: 900,
                                    lineHeight: 1.1,
                                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }, // Responsivo
                                    mb: 3
                                }}
                            >
                                Transforme Eficiência em <br />
                                <Box component="span" sx={{ color: '#4ade80' }}> {/* Verde Neon */}
                                    Resultados Financeiros
                                </Box>
                            </Typography>

                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: '#e0e7ff', 
                                    fontWeight: 300, 
                                    mb: 5,
                                    maxWidth: { xs: '100%', md: '90%' },
                                    mx: { xs: 'auto', md: 0 },
                                    fontSize: { xs: '1rem', md: '1.25rem' }
                                }}
                            >
                                A ferramenta estratégica definitiva para líderes de TI. 
                                Projete custos, valide a viabilidade e acelere aprovações.
                            </Typography>

                            <Button 
                                variant="contained" 
                                size="large" 
                                onClick={onStart}
                                startIcon={<RocketLaunch />}
                                sx={{ 
                                    backgroundColor: '#22c55e', 
                                    color: '#064e3b',
                                    fontWeight: '800',
                                    py: 2,
                                    px: 5,
                                    fontSize: '1rem',
                                    borderRadius: '50px',
                                    width: { xs: '100%', sm: 'auto' }, // Full width no mobile
                                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)', // Glow Effect
                                    '&:hover': { backgroundColor: '#4ade80' }
                                }}
                            >
                                INICIAR SIMULAÇÃO
                            </Button>
                        </Grid>

                        {/* COLUNA 2: Card Visual (AS-IS vs TO-BE) */}
                        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Paper
                                elevation={12}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    maxWidth: 400,
                                    width: '100%',
                                    position: 'relative',
                                    background: 'white',
                                    mt: { xs: 4, md: 0 }, // Margem no mobile para separar do texto
                                    transform: { md: 'rotate(-2deg)' }, // Leve rotação charmosa no desktop
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: { md: 'rotate(0deg) scale(1.02)' } }
                                }}
                            >
                                {/* Header do Card */}
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                    <Box sx={{ 
                                        bgcolor: '#e0e7ff', 
                                        p: 1.5, 
                                        borderRadius: 2,
                                        color: '#4338ca' 
                                    }}>
                                        <Assessment fontSize="large" />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" color="#1e293b">
                                            AS-IS vs TO-BE
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ letterSpacing: 1 }}>
                                            ANÁLISE COMPARATIVA
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* Conteúdo Simulado */}
                                <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, mb: 3, border: '1px solid #e2e8f0' }}>
                                    <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.6 }}>
                                        Comparativo de custos operacionais manuais vs. automatizados projetados.
                                    </Typography>
                                </Box>

                                {/* Lista de Benefícios Visual */}
                                <Stack spacing={1.5}>
                                    {['Custo de Oportunidade', 'Retorno sobre Investimento', 'Break-even Point'].map((item) => (
                                        <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                                            <CheckCircle sx={{ color: '#22c55e', fontSize: 20 }} />
                                            <Typography variant="body2" fontWeight="600" color="#334155">
                                                {item}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>

                                {/* Gráfico Fake Decorativo */}
                                <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ mt: 4, height: 60, opacity: 0.2 }}>
                                    <Box sx={{ flex: 1, bgcolor: '#4338ca', height: '40%', borderRadius: '4px 4px 0 0' }} />
                                    <Box sx={{ flex: 1, bgcolor: '#4338ca', height: '60%', borderRadius: '4px 4px 0 0' }} />
                                    <Box sx={{ flex: 1, bgcolor: '#22c55e', height: '90%', borderRadius: '4px 4px 0 0' }} />
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* FEATURES SECTION (Cards Informativos) */}
            <Container maxWidth="lg" sx={{ mt: { xs: -6, md: -8 }, position: 'relative', zIndex: 2, mb: 8 }}>
                <Grid container spacing={3}>
                    {[
                        { icon: <TrendingUp fontSize="large" />, title: 'Financeiro', desc: 'Business Case completo para aprovação de budget.' },
                        { icon: <Speed fontSize="large" />, title: 'Complexidade', desc: 'Matriz que calcula o esforço exato de desenvolvimento.' },
                        { icon: <Security fontSize="large" />, title: 'Segurança', desc: 'Dados processados em ambiente seguro corporativo.' }
                    ].map((feature, idx) => (
                        <Grid item xs={12} md={4} key={idx}>
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    p: 3, 
                                    height: '100%', 
                                    borderRadius: 3,
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-5px)' }
                                }}
                            >
                                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>{feature.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{feature.desc}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* FOOTER */}
            <Box sx={{ bgcolor: '#fff', py: 4, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    © 2025 NTT DATA Energy Industry. Todos os direitos reservados.
                </Typography>
            </Box>
        </Box>
    );
}