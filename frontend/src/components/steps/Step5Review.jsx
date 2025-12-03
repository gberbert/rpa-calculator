// frontend/src/components/steps/Step5Review.jsx
import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Divider,
    Chip,
} from '@mui/material';
import {
    CheckCircle,
    Business,
    TrendingUp,
    Settings,
    Psychology,
} from '@mui/icons-material';

export default function Step5Review({ data }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const complexity = React.useMemo(() => {
        let points = 0;
        if (data.complexity.numApplications <= 2) points += 1;
        else if (data.complexity.numApplications <= 4) points += 2;
        else points += 3;

        if (data.complexity.dataType === 'structured') points += 1;
        else if (data.complexity.dataType === 'text') points += 2;
        else points += 5;

        if (data.complexity.environment === 'web') points += 1;
        else if (data.complexity.environment === 'sap') points += 2;
        else points += 4;

        if (data.complexity.numSteps < 20) points += 1;
        else if (data.complexity.numSteps <= 50) points += 3;
        else points += 5;

        if (points >= 12) return { level: 'ALTA', color: 'error' };
        if (points >= 7) return { level: 'MÉDIA', color: 'warning' };
        return { level: 'BAIXA', color: 'success' };
    }, [data.complexity]);

    const dataTypeLabels = {
        structured: 'Estruturados (Excel, CSV)',
        text: 'Texto/E-mail',
        ocr: 'Imagem/OCR',
    };

    const environmentLabels = {
        web: 'Web/Local',
        sap: 'SAP/Mainframe',
        citrix: 'Citrix/Remoto',
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Revisão dos Dados
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Confira as informações antes de calcular o ROI
                    </Typography>
                </Box>
            </Box>

            {/* Informações do Projeto */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Business color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                        Informações do Projeto
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                            Nome do Projeto
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {data.projectName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                            Responsável
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {/* CORREÇÃO AQUI: Mostra responsibleName ou ownerUid como fallback */}
                            {data.responsibleName || data.ownerUid || 'Não informado'}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Cenário AS-IS */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                        Cenário AS-IS (Atual)
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                            Volume Mensal
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {parseFloat(data.inputs.volume).toLocaleString('pt-BR')} transações
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                            AHT
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {data.inputs.aht} minutos
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                            Custo FTE
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {formatCurrency(data.inputs.fteCost)}/mês
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                            Taxa de Erro
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {data.inputs.errorRate}%
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Complexidade */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Settings color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
                        Análise de Complexidade
                    </Typography>
                    <Chip
                        label={`Complexidade: ${complexity.level}`}
                        color={complexity.color}
                        sx={{ fontWeight: 600 }}
                    />
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                            Nº de Aplicações
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {data.complexity.numApplications}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                            Tipo de Dados
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {dataTypeLabels[data.complexity.dataType]}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                            Ambiente
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {environmentLabels[data.complexity.environment]}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                            Nº de Passos
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {data.complexity.numSteps}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Estratégia & Cognitivo */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Psychology color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                        Estratégia & Cognitivo
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="caption" color="text.secondary">
                            Nível Cognitivo
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {data.strategic?.cognitiveLevel === 'rule' && 'Regra Fixa'}
                            {data.strategic?.cognitiveLevel === 'interpretation' && 'Interpretação'}
                            {data.strategic?.cognitiveLevel === 'creation' && 'Criação (GenAI)'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="caption" color="text.secondary">
                            Variabilidade
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {data.strategic?.inputVariability === 'never' && 'Baixa'}
                            {data.strategic?.inputVariability === 'occasionally' && 'Média'}
                            {data.strategic?.inputVariability === 'always' && 'Alta'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="caption" color="text.secondary">
                            Disponibilidade 24/7
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {data.strategic?.needs24h ? 'Sim' : 'Não'}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Box
                sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: 'success.lighter',
                    borderLeft: 4,
                    borderColor: 'success.main',
                    borderRadius: 1,
                }}
            >
                <Typography variant="body2" color="success.dark">
                    <strong>Tudo pronto!</strong> Clique em "Calcular ROI" para processar os dados
                    e visualizar os resultados financeiros da automação.
                </Typography>
            </Box>
        </Box>
    );
}