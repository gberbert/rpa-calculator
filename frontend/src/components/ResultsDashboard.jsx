// frontend/src/components/ResultsDashboard.jsx
import React, { useRef, useState } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent, Chip, Divider, Button, Container, Tooltip as MuiTooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
    TrendingUp, AttachMoney, Schedule, Assessment, Refresh, Download, Info, Description
} from '@mui/icons-material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';

// Importações para PDF
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 1. IMPORTAR O CONTEXTO DE AUTH
import { useAuth } from '../contexts/AuthContext';

export default function ResultsDashboard({ data, onNewCalculation }) {
    const dashboardRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    
    // 2. PEGAR O USUÁRIO LOGADO
    const { currentUser } = useAuth();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(value);
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
    };

    // Lógica para exibir o nome correto do responsável
    const getResponsibleName = () => {
        // Se o projeto tem o mesmo ID do usuário logado, mostramos o email dele
        if (currentUser && data.owner_uid === currentUser.uid) {
            return currentUser.email;
        }
        // Se for um projeto antigo ou de outro usuário (modo admin), mostramos o ID ou um fallback
        return data.owner_uid || 'Anônimo';
    };

    const results = data.results;
    const complexity = data.complexity_score;
    const inputs = data.inputs_as_is;

    // Dados gráficos
    const costComparisonData = [
        { name: 'AS-IS (Atual)', Anual: results.as_is_cost_annual, Mensal: results.as_is_cost_annual / 12 },
        { name: 'TO-BE (Automação)', Anual: results.to_be_cost_annual, Mensal: results.to_be_cost_annual / 12 },
    ];

    const toBeCostBreakdown = [
        { name: 'Licenças', value: results.cost_breakdown.licenseCost },
        { name: 'Infraestrutura', value: results.cost_breakdown.infraCost },
        { name: 'Manutenção', value: results.cost_breakdown.maintenanceCost },
    ];

    const paybackData = [];
    const monthlySavings = results.monthly_savings;
    let accumulated = -results.development_cost;
    const monthsToProject = Math.max(Math.ceil(results.payback_months || 0) + 2, 12);

    for (let month = 0; month <= monthsToProject; month++) {
        accumulated += monthlySavings;
        paybackData.push({ month: month, accumulated: accumulated });
    }

    const COLORS = ['#667eea', '#764ba2', '#f093fb'];

    const getComplexityColor = (classification) => {
        if (classification === 'HIGH') return 'error';
        if (classification === 'MEDIUM') return 'warning';
        return 'success';
    };

    // --- FUNÇÃO DE EXPORTAÇÃO PDF ---
    const handleExportPDF = async () => {
        if (!dashboardRef.current) return;
        setIsExporting(true);

        try {
            const element = dashboardRef.current;
            
            const canvas = await html2canvas(element, {
                scale: 2, 
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            });

            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = 210; 
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            const pdf = new jsPDF('p', 'mm', [pdfWidth, imgHeight]);

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
            pdf.save(`Relatorio_ROI_${data.project_name.replace(/\s+/g, '_')}.pdf`);

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Erro ao gerar o PDF.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header / Ações */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>Resultados da Análise</Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>Visualização Web</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={isExporting ? <Refresh sx={{ animation: 'spin 1s linear infinite' }}/> : <Download />}
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
                        >
                            {isExporting ? 'Gerando PDF...' : 'Exportar PDF'}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={onNewCalculation}
                            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
                        >
                            Nova Simulação
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* ÁREA DE CAPTURA PARA O PDF */}
            <div ref={dashboardRef} style={{ backgroundColor: '#f4f6f8', padding: '30px' }}>
                
                {/* CABEÇALHO DO RELATÓRIO */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-end', 
                        mb: 4, 
                        borderBottom: '2px solid #1a237e', 
                        pb: 2 
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/logo.png" alt="NTT DATA" style={{ height: '40px', marginRight: '15px' }} />
                        <Box>
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                                Relatório de Viabilidade RPA
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Gerado em: {new Date().toLocaleDateString()} às {new Date().toLocaleTimeString()}
                            </Typography>
                        </Box>
                    </Box>

                    {/* LADO DIREITO: Nome do Projeto e Responsável CORRIGIDO */}
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ lineHeight: 1.2 }}>
                            {data.project_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Responsável: {getResponsibleName()}
                        </Typography>
                    </Box>
                </Box>

                {/* RESTANTE DO DASHBOARD (Mantido igual) */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TrendingUp sx={{ mr: 1 }} />
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>ROI Ano 1</Typography>
                                </Box>
                                <Typography variant="h3" fontWeight={700}>{formatNumber(results.roi_year_1)}%</Typography>
                                <Chip label={results.roi_year_1 >= 100 ? 'Excelente' : results.roi_year_1 >= 50 ? 'Bom' : 'Atenção'} size="small" sx={{ mt: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AttachMoney sx={{ mr: 1, color: 'success.main' }} />
                                    <Typography variant="body2" color="text.secondary">Economia Anual</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={700} color="success.main">{formatCurrency(results.annual_savings)}</Typography>
                                <Typography variant="caption" color="text.secondary">{formatCurrency(results.monthly_savings)}/mês</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Schedule sx={{ mr: 1, color: 'info.main' }} />
                                    <Typography variant="body2" color="text.secondary">Payback</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={700} color="info.main">{formatNumber(results.payback_months)}</Typography>
                                <Typography variant="caption" color="text.secondary">meses</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Assessment sx={{ mr: 1, color: getComplexityColor(complexity.classification) }} />
                                    <Typography variant="body2" color="text.secondary">Complexidade</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={700}>{complexity.classification}</Typography>
                                <Typography variant="caption" color="text.secondary">{complexity.hours.totalHours}h desenvolvimento</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Comparação de Custos</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={costComparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="Anual" fill="#667eea" />
                                    <Bar dataKey="Mensal" fill="#764ba2" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Composição Custos TO-BE</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={toBeCostBreakdown} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                                        {toBeCostBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Projeção de Payback</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={paybackData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" label={{ value: 'Meses', position: 'insideBottom', offset: -5 }} />
                                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Line type="monotone" dataKey="accumulated" stroke="#667eea" strokeWidth={3} name="Economia Acumulada" />
                                    <Line type="monotone" dataKey={() => 0} stroke="#ff0000" strokeDasharray="5 5" name="Break-even" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>

                <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Detalhamento Financeiro</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Investimento Inicial (CAPEX)</Typography>
                            <Box sx={{ pl: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Esforço de Implementação ({complexity.hours.totalHours}h)</Typography>
                                    <Typography variant="body2" fontWeight={600}>{formatCurrency(results.development_cost)}</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" fontWeight={600}>Total Investimento</Typography>
                                    <Typography variant="body1" fontWeight={700} color="primary">{formatCurrency(results.development_cost)}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Custos Operacionais Anuais (OPEX)</Typography>
                            <Box sx={{ pl: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Licenças RPA</Typography>
                                    <Typography variant="body2" fontWeight={600}>{formatCurrency(results.cost_breakdown.licenseCost)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Infraestrutura</Typography>
                                    <Typography variant="body2" fontWeight={600}>{formatCurrency(results.cost_breakdown.infraCost)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Manutenção e Sustentação</Typography>
                                    <Typography variant="body2" fontWeight={600}>{formatCurrency(results.cost_breakdown.maintenanceCost)}</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" fontWeight={600}>Total Anual</Typography>
                                    <Typography variant="body1" fontWeight={700} color="primary">{formatCurrency(results.to_be_cost_annual)}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ p: 4, borderRadius: 2, backgroundColor: '#fff', borderTop: '4px solid #667eea' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Description color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            Metodologia e Memória de Cálculo
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
                                1. Entradas (Inputs)
                            </Typography>
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '40%' }}>Volume Mensal</TableCell>
                                        <TableCell>Quantidade média de transações processadas por mês ({inputs.volume.toLocaleString()}).</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>AHT (Tempo Médio)</TableCell>
                                        <TableCell>Average Handle Time: Tempo que um humano leva para processar um item ({inputs.aht} min).</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Custo FTE</TableCell>
                                        <TableCell>Custo mensal total de um funcionário (Full Time Equivalent) incluindo encargos ({formatCurrency(inputs.fte_cost)}).</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Taxa de Erro</TableCell>
                                        <TableCell>Percentual de retrabalho ou erro no processo manual ({inputs.error_rate}%).</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
                                2. Matriz de Complexidade
                            </Typography>
                            <Typography variant="body2" paragraph>
                                A complexidade é calculada somando pontos baseados em: Nº de Aplicações, Tipo de Dados, Ambiente e Nº de Passos.
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f0f0f0' }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Classificação</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Pontuação</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Horas Estimadas</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow selected={complexity.classification === 'LOW'}>
                                        <TableCell>BAIXA</TableCell>
                                        <TableCell>4 - 6 pontos</TableCell>
                                        <TableCell>104h</TableCell>
                                    </TableRow>
                                    <TableRow selected={complexity.classification === 'MEDIUM'}>
                                        <TableCell>MÉDIA</TableCell>
                                        <TableCell>7 - 11 pontos</TableCell>
                                        <TableCell>208h</TableCell>
                                    </TableRow>
                                    <TableRow selected={complexity.classification === 'HIGH'}>
                                        <TableCell>ALTA</TableCell>
                                        <TableCell>12+ pontos</TableCell>
                                        <TableCell>416h</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#1a237e', mt: 2 }}>
                                3. Fórmulas Utilizadas
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" color="primary">Custo AS-IS (Manual)</Typography>
                                        <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
                                            (Volume × AHT × 12) × Custo_Minuto × (1 + Erro)
                                        </Typography>
                                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                            Onde Custo_Minuto = Custo FTE / 9600 min/mês.
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" color="primary">Investimento (CAPEX)</Typography>
                                        <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
                                            Horas Totais × Taxa Blended da Squad
                                        </Typography>
                                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                            As horas vêm da matriz de complexidade e a taxa é a média ponderada dos perfis configurados.
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" color="primary">Retorno (ROI)</Typography>
                                        <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
                                            ((Economia - Investimento) / Investimento) × 100
                                        </Typography>
                                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                            Economia = Custo AS-IS - Custo TO-BE (Licenças + Infra + Manutenção).
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        </Container>
    );
}