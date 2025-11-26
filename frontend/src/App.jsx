import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import ROIWizard from './components/ROIWizard';
import ResultsDashboard from './components/ResultsDashboard';

// Tema customizado corporativo
const theme = createTheme({
    palette: {
        primary: {
            main: '#667eea',
            light: '#8b9df4',
            dark: '#4c5fd4',
        },
        secondary: {
            main: '#764ba2',
            light: '#9468bb',
            dark: '#5a3880',
        },
        success: {
            main: '#10b981',
            lighter: '#d1fae5',
            dark: '#059669',
        },
        warning: {
            main: '#f59e0b',
            lighter: '#fef3c7',
            dark: '#d97706',
        },
        error: {
            main: '#ef4444',
            lighter: '#fee2e2',
            dark: '#dc2626',
        },
        info: {
            main: '#3b82f6',
            lighter: '#dbeafe',
            dark: '#2563eb',
        },
        grey: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 8,
                    padding: '10px 24px',
                },
                contained: {
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    '&:hover': {
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                },
                elevation2: {
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                },
                elevation3: {
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: '#667eea',
                        },
                    },
                },
            },
        },
    },
});

function App() {
    const [currentView, setCurrentView] = useState('wizard'); // 'wizard' | 'results'
    const [projectData, setProjectData] = useState(null);

    const handleCalculationComplete = (data) => {
        setProjectData(data);
        setCurrentView('results');
    };

    const handleNewCalculation = () => {
        setProjectData(null);
        setCurrentView('wizard');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {currentView === 'wizard' ? (
                <ROIWizard onComplete={handleCalculationComplete} />
            ) : (
                <ResultsDashboard
                    data={projectData}
                    onNewCalculation={handleNewCalculation}
                />
            )}
        </ThemeProvider>
    );
}

export default App;
