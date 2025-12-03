import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Chip,
} from '@mui/material';
import {
    Settings,
    Apps,
    Storage,
    Cloud,
    AccountTree,
} from '@mui/icons-material';

export default function Step3Complexity({ data, onChange }) {
    const handleChange = (field, value) => {
        onChange({
            ...data,
            [field]: value,
        });
    };

    const getComplexityEstimate = () => {
        let points = 0;

        // Número de aplicações
        if (data.numApplications <= 2) points += 1;
        else if (data.numApplications <= 4) points += 2;
        else points += 3;

        // Tipo de dados
        if (data.dataType === 'structured') points += 1;
        else if (data.dataType === 'text') points += 2;
        else points += 5;

        // Ambiente
        if (data.environment === 'web') points += 1;
        else if (data.environment === 'sap') points += 2;
        else points += 4;

        // Passos
        if (data.numSteps < 20) points += 1;
        else if (data.numSteps <= 50) points += 3;
        else points += 5;

        if (points >= 12) return { level: 'ALTA', color: 'error' };
        if (points >= 7) return { level: 'MÉDIA', color: 'warning' };
        return { level: 'BAIXA', color: 'success' };
    };

    const complexity = getComplexityEstimate();

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Settings sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={600}>
                        Análise de Complexidade
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Avalie as características técnicas da automação
                    </Typography>
                </Box>
                <Chip
                    label={`Complexidade: ${complexity.level}`}
                    color={complexity.color}
                    sx={{ fontWeight: 600 }}
                />
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
                            label="Número de Aplicações"
                            type="number"
                            value={data.numApplications}
                            onChange={(e) => handleChange('numApplications', e.target.value)}
                            required
                            InputProps={{
                                startAdornment: <Apps color="action" sx={{ mr: 1 }} />,
                            }}
                            helperText="Quantos sistemas diferentes o robô irá integrar?"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Tipo de Dados</InputLabel>
                            <Select
                                value={data.dataType}
                                onChange={(e) => handleChange('dataType', e.target.value)}
                                label="Tipo de Dados"
                                startAdornment={<Storage color="action" sx={{ ml: 1, mr: 1 }} />}
                            >
                                <MenuItem value="structured">
                                    <Box>
                                        <Typography variant="body1">Estruturados</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Excel, CSV, Banco de Dados
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="text">
                                    <Box>
                                        <Typography variant="body1">Texto/E-mail</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Processamento de texto, e-mails
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="ocr">
                                    <Box>
                                        <Typography variant="body1">Imagem/OCR</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Reconhecimento de caracteres, PDFs escaneados
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Ambiente</InputLabel>
                            <Select
                                value={data.environment}
                                onChange={(e) => handleChange('environment', e.target.value)}
                                label="Ambiente"
                                startAdornment={<Cloud color="action" sx={{ ml: 1, mr: 1 }} />}
                            >
                                <MenuItem value="web">
                                    <Box>
                                        <Typography variant="body1">Web/Local</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Aplicações web ou desktop padrão
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="sap">
                                    <Box>
                                        <Typography variant="body1">SAP/Mainframe</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Sistemas legados, SAP
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="citrix">
                                    <Box>
                                        <Typography variant="body1">Citrix/Remoto</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Ambientes virtualizados, acesso remoto
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Número de Passos/Regras"
                            type="number"
                            value={data.numSteps}
                            onChange={(e) => handleChange('numSteps', e.target.value)}
                            required
                            InputProps={{
                                startAdornment: <AccountTree color="action" sx={{ mr: 1 }} />,
                            }}
                            helperText="Quantos passos ou regras de negócio o processo possui?"
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Box
                sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: 'info.lighter',
                    borderLeft: 4,
                    borderColor: 'info.main',
                    borderRadius: 1,
                }}
            >
                <Typography variant="body2" color="info.dark">
                    <strong>Nota:</strong> A complexidade é calculada automaticamente com base
                    nestes critérios e impacta diretamente no tempo de desenvolvimento e custo
                    do projeto.
                </Typography>
            </Box>
        </Box>
    );
}
