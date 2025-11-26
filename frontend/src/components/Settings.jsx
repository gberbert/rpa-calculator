// frontend/src/components/Settings.jsx
import React, { useEffect, useState } from 'react';
import { 
  Container, Paper, Typography, Grid, TextField, Button, Box, Alert, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, CircularProgress
} from '@mui/material';
import { Save, PersonAdd, Delete } from '@mui/icons-material';
import { settingsService } from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      // 1. Busca a resposta da API (que vem como { success: true, data: { ... } })
      const response = await settingsService.getSettings();
      
      // 2. O PULO DO GATO: Extraímos os dados reais de dentro de 'response.data'
      const actualData = response.data || {};

      // 3. Montamos o objeto seguro garantindo que nada seja undefined
      const safeSettings = {
          // Usa actualData, não response direto
          team_composition: actualData.team_composition || [],
          infra_costs: {
              rpa_license_annual: actualData.infra_costs?.rpa_license_annual || 0,
              virtual_machine_annual: actualData.infra_costs?.virtual_machine_annual || 0,
              database_annual: actualData.infra_costs?.database_annual || 0
          },
          // Mantém baselines se existirem, ou usa padrão
          baselines: actualData.baselines || { low: 104, medium: 208, high: 416 }
      };
      
      console.log("Dados carregados com sucesso:", safeSettings); // Debug no Console do Navegador
      setSettings(safeSettings);

    } catch (error) {
      console.error("Erro ao carregar:", error);
      setMessage({ type: 'error', text: 'Erro ao carregar dados. Verifique a conexão.' });
    } finally { setLoading(false); }
  };

  // Limpa os dados antes de salvar para evitar enviar lixo ou NaN
  const sanitizePayload = (data) => {
      const cleanTeam = (data.team_composition || []).map(member => ({
          role: member.role || 'Novo Cargo',
          rate: Number(member.rate) || 0,
          share: Number(member.share) || 0
      }));

      const cleanInfra = {
          rpa_license_annual: Number(data.infra_costs?.rpa_license_annual) || 0,
          virtual_machine_annual: Number(data.infra_costs?.virtual_machine_annual) || 0,
          database_annual: Number(data.infra_costs?.database_annual) || 0
      };

      return {
          team_composition: cleanTeam,
          infra_costs: cleanInfra,
          baselines: data.baselines // Mantém baselines
      };
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const cleanSettings = sanitizePayload(settings);
      
      // Envia para o backend
      await settingsService.updateSettings(cleanSettings);
      
      // Atualiza o estado local com os dados limpos para refletir o que foi salvo
      setSettings(cleanSettings);
      
      setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
    } catch (error) {
      console.error("Erro no salvamento:", error);
      setMessage({ type: 'error', text: 'Erro ao salvar.' });
    } finally {
        setSaving(false);
    }
  };

  // --- Funções de Interface (Inputs) ---

  const handleRoleChange = (index, field, value) => {
    const newTeam = [...settings.team_composition];
    if (field === 'role') {
        newTeam[index][field] = value;
    } else {
        // Permite edição livre (texto), validação ocorre no sanitizePayload
        newTeam[index][field] = value; 
    }
    setSettings({ ...settings, team_composition: newTeam });
  };

  const handleAddRole = () => {
    setSettings(prev => ({
        ...prev,
        team_composition: [...prev.team_composition, { role: 'Novo Cargo', rate: 0, share: 0.0 }]
    }));
  };

  const handleDeleteRole = (index) => {
    setSettings(prev => ({
        ...prev,
        team_composition: prev.team_composition.filter((_, i) => i !== index)
    }));
  };

  const updateInfraCost = (field, value) => {
      setSettings(prev => ({
          ...prev,
          infra_costs: { ...prev.infra_costs, [field]: value }
      }));
  };

  const getTotalShare = () => {
    if (!settings?.team_composition) return 0;
    return settings.team_composition.reduce((acc, curr) => acc + (parseFloat(curr.share) || 0), 0);
  };

  if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (!settings) return <Box p={4}><Alert severity="error">Não foi possível inicializar as configurações.</Alert></Box>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1a237e' }}>
        Configurações da Squad & Custos
      </Typography>
      
      {message && <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>{message.text}</Alert>}

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Composição da Squad</Typography>
            <Button variant="outlined" startIcon={<PersonAdd />} onClick={handleAddRole} size="small">
                Adicionar Cargo
            </Button>
        </Box>
        
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
                    {settings.team_composition.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                Nenhum perfil configurado.
                            </TableCell>
                        </TableRow>
                    )}
                    {settings.team_composition.map((member, index) => (
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
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => handleRoleChange(index, 'rate', e.target.value)} 
                                />
                            </TableCell>
                            <TableCell>
                                <TextField 
                                    fullWidth type="number" step="0.1" variant="standard" 
                                    value={member.share} 
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => handleRoleChange(index, 'share', e.target.value)} 
                                />
                            </TableCell>
                            <TableCell align="center">
                                <IconButton size="small" color="error" onClick={() => handleDeleteRole(index)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={2} align="right"><strong>Total Participação:</strong></TableCell>
                        <TableCell>
                            <Typography color={Math.abs(getTotalShare() - 1) > 0.01 ? 'error' : 'success.main'} fontWeight="bold">
                                {(getTotalShare() * 100).toFixed(0)}%
                            </Typography>
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Custos de Infraestrutura & Licenças (Anual)</Typography>
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <TextField 
                    fullWidth label="Licença RPA" type="number" 
                    value={settings.infra_costs.rpa_license_annual}
                    onChange={(e) => updateInfraCost('rpa_license_annual', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField 
                    fullWidth label="Servidor / VM" type="number" 
                    value={settings.infra_costs.virtual_machine_annual}
                    onChange={(e) => updateInfraCost('virtual_machine_annual', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField 
                    fullWidth label="Banco de Dados" type="number" 
                    value={settings.infra_costs.database_annual}
                    onChange={(e) => updateInfraCost('database_annual', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            startIcon={saving ? <CircularProgress size={20} color="inherit"/> : <Save />} 
            size="large" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}