import React from 'react';
import {
    Box, Typography, TextField, MenuItem,
    Switch, FormControlLabel, InputAdornment, Tooltip, Grid, Paper, IconButton
} from '@mui/material';
import { Psychology, Gavel, AccessTime, People, HelpOutline } from '@mui/icons-material';

export default function Step4Strategic({ data, onChange }) {
    const handleChange = (field) => (event) => {
        onChange({
            ...data,
            [field]: event.target.value
        });
    };

    const handleSwitchChange = (field) => (event) => {
        onChange({
            ...data,
            [field]: event.target.checked
        });
    };

    return (
        <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Psychology /> Potencial Cognitivo & Estratégico
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Defina fatores de inteligência artificial, riscos e benefícios intangíveis para refinar o cálculo do ROI.
            </Typography>

            <Grid container spacing={3}>
                {/* Seção A: IA e Capacidade Cognitiva */}
                <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            A. Inteligência Artificial (GenAI/LLM)
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Nível de Julgamento Humano"
                                    value={data.cognitiveLevel || 'rule'}
                                    onChange={handleChange('cognitiveLevel')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Tooltip title="O quanto o processo exige de 'pensamento' humano. Regras fixas são baratas. Interpretação exige IA. Criação exige GenAI (mais caro)." arrow placement="top">
                                                    <IconButton size="small" onMouseDown={(e) => e.stopPropagation()}>
                                                        <HelpOutline fontSize="small" color="action" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        )
                                    }}
                                >
                                    <MenuItem value="rule">Regra Fixa (RPA Puro)</MenuItem>
                                    <MenuItem value="interpretation">Interpretação (RPA + NLP)</MenuItem>
                                    <MenuItem value="creation">Criação/Resumo (GenAI/LLM)</MenuItem>
                                </TextField>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    {data.cognitiveLevel === 'rule' && "Baixo custo. Ideal para processos lógicos e repetitivos."}
                                    {data.cognitiveLevel === 'interpretation' && "Custo médio. Necessário para classificar e-mails ou extrair dados."}
                                    {data.cognitiveLevel === 'creation' && "Custo de tokens. Necessário para gerar respostas ou resumos complexos."}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Variabilidade do Input"
                                    value={data.inputVariability || 'never'}
                                    onChange={handleChange('inputVariability')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Tooltip title="Com que frequência o formato dos dados muda? Alta variabilidade exige soluções de IDP (Intelligent Document Processing) para não quebrar o robô." arrow placement="top">
                                                    <IconButton size="small" onMouseDown={(e) => e.stopPropagation()}>
                                                        <HelpOutline fontSize="small" color="action" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        )
                                    }}
                                >
                                    <MenuItem value="never">Baixa (Formato Fixo)</MenuItem>
                                    <MenuItem value="occasionally">Média (Muda Ocasionalmente)</MenuItem>
                                    <MenuItem value="always">Alta (Não Estruturado/Variável)</MenuItem>
                                </TextField>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    {data.inputVariability === 'always' && "Recomendado uso de IDP (Intelligent Document Processing)."}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Seção B: Risco e Estratégia */}
                <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Gavel fontSize="small" /> Risco & Compliance
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={8}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        fullWidth
                                        label="Custo da Multa/Perda"
                                        type="number"
                                        size="small"
                                        value={data.errorCost || ''}
                                        onChange={handleChange('errorCost')}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        }}
                                        helperText="Valor monetário associado à falha."
                                    />
                                    <TextField
                                        select
                                        sx={{ width: '40%' }}
                                        label="Frequência"
                                        size="small"
                                        value={data.errorCostUnit || 'per_failure'}
                                        onChange={handleChange('errorCostUnit')}
                                    >
                                        <MenuItem value="per_failure">Por Falha</MenuItem>
                                        <MenuItem value="monthly">Por Mês</MenuItem>
                                        <MenuItem value="annual">Por Ano</MenuItem>
                                    </TextField>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                    {data.errorCostUnit === 'per_failure' && "Cálculo: (Volume × Taxa Erro) × Valor"}
                                    {data.errorCostUnit === 'monthly' && "Cálculo: Valor × 12 Meses"}
                                    {data.errorCostUnit === 'annual' && "Cálculo: Valor Fixo Anual"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={data.needs24h || false}
                                            onChange={handleSwitchChange('needs24h')}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AccessTime fontSize="small" />
                                            Necessidade de Disponibilidade 24/7
                                            <Tooltip title="Se o processo precisa rodar fora do horário comercial, o custo humano triplica (3 turnos), enquanto o robô mantém o mesmo custo." arrow placement="top">
                                                <IconButton size="small" onMouseDown={(e) => e.stopPropagation()}>
                                                    <HelpOutline fontSize="small" color="action" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    }
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                                    Se marcado, o custo humano será multiplicado por 3 (turnos).
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid >

                {/* Seção C: Soft Savings (RH) */}
                < Grid item xs={12} >
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <People fontSize="small" /> Recursos Humanos (Soft Savings)
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Taxa de Rotatividade (Turnover Anual)"
                                    type="number"
                                    size="small"
                                    value={data.turnoverRate || ''}
                                    onChange={handleChange('turnoverRate')}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography variant="caption" sx={{ mr: 1 }}>%</Typography>
                                                <Tooltip title="Porcentagem anual de funcionários que deixam a função. Automatizar reduz custos de recontratação e treinamento." arrow placement="top">
                                                    <IconButton edge="end" size="small"><HelpOutline fontSize="small" color="action" /></IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        )
                                    }}
                                    helperText="Economia com recrutamento e treinamento."
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid >
            </Grid >
        </Box >
    );
}
