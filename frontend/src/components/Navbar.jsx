import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Container, 
  IconButton, Collapse, List, ListItemButton, ListItemIcon, 
  ListItemText, useTheme, useMediaQuery, Divider, Tooltip, Stack
} from '@mui/material';
import { Calculate, History, Settings, Menu as MenuIcon, Close, Logout, Person } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { appVersion } from '../version'; // <--- IMPORTAR A VERSÃO AQUI

export default function Navbar({ currentView, onViewChange }) {
  const { currentUser, isAdmin, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); 
  
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleNavigation = (view) => {
    onViewChange(view);
    setMobileOpen(false);
  };

  const handleLogoClick = () => {
    onViewChange('home');
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
        await logout();
    } catch (error) {
        console.error("Erro ao sair", error);
    }
  };

  const menuItems = [
    { label: 'Simulador', icon: <Calculate sx={{ color: 'white' }} />, view: 'wizard' },
    { label: 'Histórico', icon: <History sx={{ color: 'white' }} />, view: 'history' },
  ];

  if (isAdmin) {
    menuItems.push({ label: 'Configurações', icon: <Settings sx={{ color: 'white' }} />, view: 'settings' });
  }

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #1a237e 0%, #283593 100%)', mb: 4 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          {/* LOGO COM TOOLTIP DE VERSÃO NO DESKTOP */}
          <Tooltip title={`Versão: v${appVersion}`}>
            <Box 
              onClick={handleLogoClick}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
                mr: 2,
                flexGrow: 1,
                '&:hover': { opacity: 0.9 }
              }}
            >
              <Box 
                  component="img"
                  src="/logo.png"
                  alt="Logo"
                  sx={{ 
                      height: 40,
                      width: 'auto',
                      mr: 1.5,
                  }}
              />
              
              <Box>
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        fontWeight: 'bold', 
                        userSelect: 'none', 
                        whiteSpace: 'nowrap',
                        lineHeight: 1.2
                    }}
                >
                    RPA ROI Navigator
                </Typography>
                {/* Versão visível apenas em desktop, pequena abaixo do logo (opcional) */}
                {!isMobile && (
                  <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.7rem', display: 'block' }}>
                    v{appVersion}
                  </Typography>
                )}
              </Box>
            </Box>
          </Tooltip>

          {isMobile ? (
            <IconButton size="large" edge="end" color="inherit" onClick={handleDrawerToggle}>
              {mobileOpen ? <Close /> : <MenuIcon />}
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Stack direction="row" spacing={1}>
                {menuItems.map((item) => (
                  <Button 
                    key={item.view} 
                    color="inherit" 
                    startIcon={item.icon}
                    onClick={() => handleNavigation(item.view)}
                    sx={{ 
                        borderBottom: currentView === item.view ? '2px solid white' : '2px solid transparent', 
                        borderRadius: 0, 
                        opacity: currentView === item.view ? 1 : 0.8,
                        whiteSpace: 'nowrap',
                        px: 2,
                        minWidth: 'auto'
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
              
              <Box sx={{ width: 1, height: 24, bgcolor: 'rgba(255,255,255,0.3)', mx: 2 }} />
              
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title={`Logado como: ${currentUser?.email}`}>
                    <IconButton color="inherit" size="small"><Person /></IconButton>
                </Tooltip>
                <Tooltip title="Sair">
                    <IconButton color="inherit" onClick={handleLogout}><Logout /></IconButton>
                </Tooltip>
              </Stack>
            </Box>
          )}
        </Toolbar>

        {/* MENU MOBILE */}
        <Collapse in={isMobile && mobileOpen} timeout="auto" unmountOnExit>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <List component="nav">
              {menuItems.map((item) => (
                <ListItemButton 
                  key={item.view} onClick={() => handleNavigation(item.view)} selected={currentView === item.view}
                  sx={{ 
                    '&.Mui-selected': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }, 
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                    paddingY: 2 
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: currentView === item.view ? 'bold' : 'medium', color: 'white' }} />
                </ListItemButton>
              ))}
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
              <ListItemButton onClick={handleLogout}>
                  <ListItemIcon sx={{ minWidth: 40 }}><Logout sx={{ color: 'white' }}/></ListItemIcon>
                  <ListItemText primary="Sair" primaryTypographyProps={{ color: 'white' }} />
              </ListItemButton>
            </List>
            
            {/* VERSÃO NO RODAPÉ DO MENU MOBILE */}
            <Box sx={{ p: 2, textAlign: 'center', opacity: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'white' }}>
                    RPA ROI Navigator v{appVersion}
                </Typography>
            </Box>
          </Box>
        </Collapse>
      </Container>
    </AppBar>
  );
}