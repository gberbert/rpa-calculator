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
    'Informações do Projeto',
    'Cenário AS-IS',
    'Complexidade',
    'Revisão',
];

export default function ROIWizard({ onComplete }) {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estado do formulário
    const [formData, setFormData] = useState({
        // Step 1
        projectName: '',
        ownerUid: 'anonymous',

        // Step 2 - AS-IS Inputs
        inputs: {
            volume: '',
            aht: '',
            fteCost: '',
            errorRate: 0,
        },

        // Step 3 - Complexity
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
            // Converter strings para números
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
                return (
                    <Step1ProjectInfo
                        data={formData}
                        onChange={updateFormData}
                    />
                );
            case 1:
                return (
                    <Step2AsIsInputs
                        data={formData.inputs}
                        onChange={(value) => updateFormData('inputs', value)}
                    />
                );
            case 2:
                return (
                    <Step3Complexity
                        data={formData.complexity}
                        onChange={(value) => updateFormData('complexity', value)}
                    />
                );
            case 3:
                return <Step4Review data={formData} />;
            default:
                return <Typography>Passo desconhecido</Typography>;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    mb: 3,
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
                    RPA ROI Navigator
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Calcule o retorno sobre investimento de suas automações
                </Typography>
            </Paper>

            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
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

                <Box sx={{ minHeight: 400 }}>
                    {renderStepContent(activeStep)}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        disabled={activeStep === 0 || loading}
                        onClick={handleBack}
                        startIcon={<NavigateBefore />}
                        variant="outlined"
                    >
                        Voltar
                    </Button>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {activeStep === steps.length - 1 ? (
                            <>
                                <Button
                                    onClick={handleReset}
                                    variant="outlined"
                                    disabled={loading}
                                >
                                    Reiniciar
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    startIcon={loading ? <CircularProgress size={20} /> : <Calculate />}
                                    disabled={loading || !isStepValid()}
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
