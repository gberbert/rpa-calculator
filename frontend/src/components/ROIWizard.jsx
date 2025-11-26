// frontend/src/components/ROIWizard.jsx
import React, { useState } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Paper,
    Container,
    CircularProgress,
    Alert,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    NavigateNext,
    NavigateBefore,
    Calculate,
} from '@mui/icons-material';
import Step1ProjectInfo from './steps/Step1ProjectInfo';
import Step2AsIsInputs from './steps/Step2AsIsInputs';
import Step3Complexity from './steps/Step3Complexity';
import Step4Review from './steps/Step4Review';
import { projectService } from '../services/api';

const steps = [
    'Projeto', // Encurtei os nomes para mobile
    'Cenário',
    'Complexidade',
    'Revisão',
];

export default function ROIWizard({ onComplete }) {
    const theme = useTheme();
    // Detecta se é mobile (tela menor que 'sm' - aprox 600px)
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estado do formulário
    const [formData, setFormData] = useState({
        projectName: '',
        ownerUid: 'anonymous',
        inputs: {
            volume: '',
            aht: '',
            fteCost: '',
            errorRate: 0,
        },
        complexity: {
            numApplications: 1,
            dataType: 'structured',
            environment: 'web',
            numSteps: 10,
        },
    });

    const handleNext = () => {
        setError(null);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setError(null);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setError(null);
        setFormData({
            projectName: '',
            ownerUid: 'anonymous',
            inputs: {
                volume: '',
                aht: '',
                fteCost: '',
                errorRate: 0,
            },
            complexity: {
                numApplications: 1,
                dataType: 'structured',
                environment: 'web',
                numSteps: 10,
            },
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                projectName: formData.projectName,
                ownerUid: formData.ownerUid,
                inputs: {
                    volume: parseFloat(formData.inputs.volume),
                    aht: parseFloat(formData.inputs.aht),
                    fteCost: parseFloat(formData.inputs.fteCost),
                    errorRate: parseFloat(formData.inputs.errorRate) || 0,
                },
                complexity: {
                    numApplications: parseInt(formData.complexity.numApplications),
                    dataType: formData.complexity.dataType,
                    environment: formData.complexity.environment,
                    numSteps: parseInt(formData.complexity.numSteps),
                },
            };
            const result = await projectService.createProject(payload);

            if (result.success) {
                onComplete(result.data);
            } else {
                setError(result.error || 'Erro ao criar projeto');
            }
        } catch (err) {
            console.error('Error submitting project:', err);
            setError(err.response?.data?.error || 'Erro ao processar solicitação');
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const isStepValid = () => {
        switch (activeStep) {
            case 0:
                return formData.projectName.trim().length > 0;
            case 1:
                return (
                    formData.inputs.volume > 0 &&
                    formData.inputs.aht > 0 &&
                    formData.inputs.fteCost > 0
                );
            case 2:
                return (
                    formData.complexity.numApplications > 0 &&
                    formData.complexity.numSteps > 0
                );
            case 3:
                return true;
            default:
                return false;
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return <Step1ProjectInfo data={formData} onChange={updateFormData} />;
            case 1:
                return <Step2AsIsInputs data={formData.inputs} onChange={(value) => updateFormData('inputs', value)} />;
            case 2:
                return <Step3Complexity data={formData.complexity} onChange={(value) => updateFormData('complexity', value)} />;
            case 3:
                return <Step4Review data={formData} />;
            default:
                return <Typography>Passo desconhecido</Typography>;
        }
    };

    return (
        // Remove padding horizontal excessivo do Container no mobile
        <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4, px: isMobile ? 1 : 3 }}>
            
            {/* Banner Superior */}
            <Paper
                elevation={3}
                sx={{
                    p: isMobile ? 3 : 4, // Padding menor no mobile
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    mb: 3,
                }}
            >
                <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom fontWeight={700}>
                    RPA ROI Navigator
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    Calcule o retorno sobre investimento de suas automações
                </Typography>
            </Paper>

            <Paper elevation={2} sx={{ p: isMobile ? 2 : 4, borderRadius: 2 }}>
                
                {/* CORREÇÃO DO STEPPER: 
                    alternativeLabel coloca o texto embaixo da bolinha.
                    Isso economiza espaço lateral.
                */}
                <Stepper 
                    activeStep={activeStep} 
                    alternativeLabel={isMobile} // Ativa apenas no mobile (ou sempre, se preferir)
                    sx={{ mb: 4 }}
                >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ minHeight: isMobile ? 300 : 400 }}>
                    {renderStepContent(activeStep)}
                </Box>

                {/* Botões de Ação */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, flexDirection: isMobile ? 'column-reverse' : 'row', gap: 2 }}>
                    <Button
                        disabled={activeStep === 0 || loading}
                        onClick={handleBack}
                        startIcon={<NavigateBefore />}
                        variant="outlined"
                        fullWidth={isMobile} // Botão largura total no mobile
                        size={isMobile ? "large" : "medium"}
                    >
                        Voltar
                    </Button>

                    <Box sx={{ display: 'flex', gap: 2, width: isMobile ? '100%' : 'auto' }}>
                        {activeStep === steps.length - 1 ? (
                            <>
                                {/* No último passo, mostramos Reiniciar e Calcular */}
                                {!isMobile && (
                                    <Button
                                        onClick={handleReset}
                                        variant="outlined"
                                        disabled={loading}
                                    >
                                        Reiniciar
                                    </Button>
                                )}
                                
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <Calculate />}
                                    disabled={loading || !isStepValid()}
                                    fullWidth={isMobile}
                                    size={isMobile ? "large" : "medium"}
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                        },
                                    }}
                                >
                                    {loading ? 'Calculando...' : 'Calcular ROI'}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={handleNext}
                                variant="contained"
                                endIcon={<NavigateNext />}
                                disabled={!isStepValid()}
                                fullWidth={isMobile}
                                size={isMobile ? "large" : "medium"}
                            >
                                Próximo
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}