import React from 'react';
import {
    Box,
    TextField,
    Typography,
    Paper,
    Grid,
    InputAdornment,
    Slider,
} from '@mui/material';
import {
    TrendingUp,
    AccessTime,
    AttachMoney,
    ErrorOutline,
} from '@mui/icons-material';

export default function Step2AsIsInputs({ data, onChange }) {
    const handleChange = (field, value) => {
        onChange({
            ...data,
            [field]: value,
        });
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Cenário AS-IS (Atual)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Informe os dados da operação manual atual
                    </Typography>
                </Box>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Volume Mensal"
                            type="number"
                            value={data.volume}
                            onChange={(e) => handleChange('volume', e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TrendingUp color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            helperText="Quantidade de transações processadas por mês"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="AHT (Average Handle Time)"
                            type="number"
                            value={data.aht}
                            onChange={(e) => handleChange('aht', e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccessTime color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">minutos</InputAdornment>
                                ),
                            }}
                            helperText="Tempo médio para processar cada transação"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Custo Médio do FTE"
                            type="number"
                            value={data.fteCost}
                            onChange={(e) => handleChange('fteCost', e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoney color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">R$ / mês</InputAdornment>
                                ),
                            }}
                            helperText="Custo mensal de um funcionário (Full Time Equivalent)"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Taxa de Erro Humano (Opcional)
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <ErrorOutline color="action" />
                                <Slider
                                    value={parseFloat(data.errorRate) || 0}
                                    onChange={(e, value) => handleChange('errorRate', value)}
                                    min={0}
                                    max={20}
                                    step={0.5}
                                    marks={[
                                        { value: 0, label: '0%' },
                                        { value: 10, label: '10%' },
                                        { value: 20, label: '20%' },
                                    ]}
                                    valueLabelDisplay="auto"
                                    valueLabelFormat={(value) => `${value}%`}
                                    sx={{ flex: 1 }}
                                />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                Percentual de retrabalho devido a erros manuais
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Box
                sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: 'warning.lighter',
                    borderLeft: 4,
                    borderColor: 'warning.main',
                    borderRadius: 1,
                }}
            >
                <Typography variant="body2" color="warning.dark">
                    <strong>Importante:</strong> Estes dados representam o cenário atual (AS-IS)
                    antes da automação. Quanto mais precisos, melhor será o cálculo do ROI.
                </Typography>
            </Box>
        </Box>
    );
}
