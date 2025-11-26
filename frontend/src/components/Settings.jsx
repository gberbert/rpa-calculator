// frontend/src/components/Settings.jsx
import React, { useEffect, useState } from 'react';
import { 
  Container, Paper, Typography, Grid, TextField, Button, Box, Alert, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip 
} from '@mui/material';
import { Save, PersonAdd, Delete } from '@mui/icons-material';
import { settingsService } from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      if (!data.team_composition) data.team_composition = [];
      setSettings(data);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Erro ao carregar dados.' });
    } finally { setLoading(false); }
  };

  const handleRoleChange = (index, field, value) => {
    const newTeam = [...settings.team_composition];
    newTeam[index][field] = field === 'role' ? value : parseFloat(value);
    setSettings({ ...settings, team_composition: newTeam });
  };

  const handleAddRole = () => {
    const newTeam = [
        ...(settings.team_composition || []), 
        { role: 'Novo Cargo', rate: 0, share: 0.0 }
    ];
    setSettings({ ...settings, team_composition: newTeam });
  };

  const handleDeleteRole = (index) => {
    const newTeam = settings.team_composition.filter((_, i) => i !== index);
    setSettings({ ...settings, team_composition: newTeam });
  };

  const getTotalShare = () => {
    if (!settings?.team_composition) return 0;
    return settings.team_composition.reduce((acc, curr) => acc + (parseFloat(curr.share) || 0), 0);
  };

  const handleSave = async () => {
    if (settings.team_composition.length > 0 && Math.abs(getTotalShare() - 1.0) > 0.01) {
      setMessage({ type: 'warning', text: 'Atenção: A soma da participação (%) deve ser 100% (1.0).' });
    }
    try {
      await settingsService.updateSettings(settings);
      setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar.' });
    }
  };

  if (loading || !settings) return <Box p={4}>Carregando...</Box>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1a237e' }}>
        Configurações da Squad & Custos
      </Typography>
      
      {message && <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>{message.text}</Alert>}

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Composição da Squad</Typography>
            <Button 
                variant="outlined" 
                startIcon={<PersonAdd />} 
                onClick={handleAddRole}
                size="small"
            >
                Adicionar Cargo
            </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Defina os perfis. O custo de desenvolvimento será uma média ponderada.
        </Typography>

        <TableContainer sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Table size="small">
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                        <TableCell>Perfil / Cargo</TableCell>
                        <TableCell width="20%">Custo Hora (R$)</TableCell>
                        <TableCell width="20%">Participação (0.0 a 1.0)</TableCell>
                        <TableCell width="10%" align="center">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {settings.team_composition?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                Nenhum perfil configurado. Clique em "Adicionar Cargo".
                            </TableCell>
                        </TableRow>
                    )}
                    {settings.team_composition?.map((member, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <TextField 
                                    fullWidth variant="standard" 
                                    value={member.role} 
                                    onChange={(e) => handleRoleChange(index, 'role', e.target.value)} 
                                />
                            </TableCell>
                            <TableCell>
                                <TextField 
                                    fullWidth type="number" variant="standard" 
                                    value={member.rate} 
                                    onChange={(e) => handleRoleChange(index, 'rate', e.target.value)} 
                                />
                            </TableCell>
                            <TableCell>
                                <TextField 
                                    fullWidth type="number" step="0.1" variant="standard" 
                                    value={member.share} 
                                    error={getTotalShare() > 1.01}
                                    onChange={(e) => handleRoleChange(index, 'share', e.target.value)} 
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Tooltip title="Remover">
                                    <IconButton size="small" color="error" onClick={() => handleDeleteRole(index)}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                    {settings.team_composition?.length > 0 && (
                        <TableRow>
                            <TableCell colSpan={2} align="right"><strong>Total Participação:</strong></TableCell>
                            <TableCell>
                                <Typography color={Math.abs(getTotalShare() - 1) > 0.01 ? 'error' : 'success.main'} fontWeight="bold">
                                    {(getTotalShare() * 100).toFixed(0)}%
                                </Typography>
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Custos de Infraestrutura & Licenças (Anual)</Typography>
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <TextField 
                    fullWidth 
                    label="Licença RPA (Bot Runner)" 
                    type="number" 
                    value={settings.infra_costs?.rpa_license_annual ?? 0}
                    onChange={(e) => setSettings({...settings, infra_costs: {...settings.infra_costs, rpa_license_annual: parseFloat(e.target.value)}})}
                    InputLabelProps={{ shrink: true }} // <--- CORREÇÃO AQUI
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField 
                    fullWidth 
                    label="Servidor / VM" 
                    type="number" 
                    value={settings.infra_costs?.virtual_machine_annual ?? 0}
                    onChange={(e) => setSettings({...settings, infra_costs: {...settings.infra_costs, virtual_machine_annual: parseFloat(e.target.value)}})}
                    InputLabelProps={{ shrink: true }} // <--- CORREÇÃO AQUI
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField 
                    fullWidth 
                    label="Banco de Dados / Storage" 
                    type="number" 
                    value={settings.infra_costs?.database_annual ?? 0}
                    onChange={(e) => setSettings({...settings, infra_costs: {...settings.infra_costs, database_annual: parseFloat(e.target.value)}})}
                    InputLabelProps={{ shrink: true }} // <--- CORREÇÃO AQUI
                />
            </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" startIcon={<Save />} size="large" onClick={handleSave}>
            Salvar Configurações
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}