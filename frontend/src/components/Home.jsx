// frontend/src/components/Home.jsx
import React from 'react';
import { 
    Box, Container, Typography, Button, Grid, Paper, 
    List, ListItem, ListItemIcon, ListItemText, Divider 
} from '@mui/material';
import { 
    RocketLaunch, TrendingUp, Speed, Security, 
    Assessment, CheckCircle 
} from '@mui/icons-material';

export default function Home({ onStart }) {
    return (
        <Box>
            {/* HERO SECTION */}
            <Box 
                sx={{ 
                    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)', 
                    color: 'white', 
                    py: 8, 
                    mb: 6,
                    borderRadius: '0 0 50% 50% / 4%', // Curva suave na base
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>
                        RPA ROI NAVIGATOR
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 2, mt: 1 }}>
                        Transforme Eficiência em <br/>Resultados Financeiros
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, fontWeight: 'light', maxWidth: '800px', mx: 'auto' }}>
                        Uma ferramenta de decisão estratégica para líderes de Energia e TI. 
                        Projete custos, calcule o payback e valide a viabilidade técnica de suas automações.
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large" 
                        onClick={onStart}
                        startIcon={<RocketLaunch />}
                        sx={{ 
                            backgroundColor: '#00e676', 
                            color: '#003300',
                            fontWeight: 'bold',
                            padding: '12px 32px',
                            fontSize: '1.1rem',
                            '&:hover': { backgroundColor: '#69f0ae' }
                        }}
                    >
                        Iniciar Nova Simulação
                    </Button>
                </Container>
            </Box>

            {/* FEATURES SECTION */}
            <Container maxWidth="lg" sx={{ mb: 8 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 4, height: '100%', borderRadius: 4 }}>
                            <Assessment color="primary" sx={{ fontSize: 40, mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Modelagem AS-IS vs TO-BE
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Compare o custo operacional atual (FTEs, Erros, AHT) contra o cenário automatizado.
                            </Typography>
                            <List dense>
                                <ListItem disablePadding>
                                    <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Custo de Oportunidade" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Redução de Erros" />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 4, height: '100%', borderRadius: 4, borderTop: '4px solid #667eea' }}>
                            <Speed color="primary" sx={{ fontSize: 40, mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Algoritmo de Complexidade
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Não chute prazos. Nossa matriz proprietária calcula o esforço de desenvolvimento.
                            </Typography>
                            <List dense>
                                <ListItem disablePadding>
                                    <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Análise de Ambiente (Citrix/SAP)" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Tipologia de Dados (OCR/Estruturado)" />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 4, height: '100%', borderRadius: 4 }}>
                            <TrendingUp color="primary" sx={{ fontSize: 40, mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Projeção Financeira
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Gere um Business Case completo para aprovação de budget executivo.
                            </Typography>
                            <List dense>
                                <ListItem disablePadding>
                                    <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Cálculo de Payback (Meses)" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon><CheckCircle color="success" fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="ROI de 1º, 3º e 5º ano" />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* TECHNICAL FOOTER */}
            <Box sx={{ bgcolor: '#f5f5f5', py: 4, borderTop: '1px solid #e0e0e0' }}>
                <Container maxWidth="lg">
                    <Grid container alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Metodologia:</strong> Baseada em melhores práticas de CoE (Center of Excellence) para automação inteligente.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
                                <Security fontSize="small" color="disabled" />
                                <Typography variant="caption" color="text.secondary">
                                    Ambiente Seguro • Cálculos Locais e Nuvem
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}