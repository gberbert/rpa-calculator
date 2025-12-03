// frontend/src/App.jsx
import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ROIWizard from './components/ROIWizard';
import ResultsDashboard from './components/ResultsDashboard';
import ProjectHistory from './components/ProjectHistory';
import Settings from './components/Settings';
import ReloadPrompt from './components/ReloadPrompt';
import Login from './components/Login';
import SignUp from './components/SignUp'; // <--- Importar
import { AuthProvider, useAuth } from './contexts/AuthContext';

const theme = createTheme({
    palette: {
        primary: { main: '#667eea' },
        secondary: { main: '#764ba2' },
        background: { default: '#f4f6f8' }
    },
    typography: { fontFamily: '"Inter", sans-serif' },
    shape: { borderRadius: 8 },
});

function AppContent() {
    const { currentUser } = useAuth();
    const [currentView, setCurrentView] = useState('home');
    const [authMode, setAuthMode] = useState('login'); // 'login' ou 'signup'
    const [selectedProject, setSelectedProject] = useState(null);

    // Se não estiver logado, gerencia entre Login e Cadastro
    if (!currentUser) {
        if (authMode === 'signup') {
            return <SignUp onSwitchToLogin={() => setAuthMode('login')} />;
        }
        return <Login onSwitchToRegister={() => setAuthMode('signup')} />;
    }

    // ... lógica do app logado ...
    const handleCalculationComplete = (data) => {
        setSelectedProject(data);
        setCurrentView('results');
    };
    const handleNewCalculation = () => {
        setSelectedProject(null);
        setCurrentView('wizard');
    };
    const handleViewProject = (project) => {
        setSelectedProject(project);
        setCurrentView('results');
    };

    return (
        <>
            <Navbar currentView={currentView} onViewChange={setCurrentView} />
            <Box sx={{ pb: 8 }}>
                {currentView === 'home' && <Home onStart={handleNewCalculation} />}
                {currentView === 'wizard' && <ROIWizard onComplete={handleCalculationComplete} />}
                {currentView === 'results' && selectedProject && <ResultsDashboard data={selectedProject} onNewCalculation={handleNewCalculation} />}
                {currentView === 'history' && <ProjectHistory onViewProject={handleViewProject} />}
                {currentView === 'settings' && <Settings />}
            </Box>
            <ReloadPrompt />
        </>
    );
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;