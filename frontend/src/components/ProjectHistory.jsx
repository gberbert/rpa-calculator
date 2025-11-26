// frontend/src/components/ProjectHistory.jsx
import React, { useEffect, useState } from 'react';
import { 
  Container, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, Box, CircularProgress, Alert, Button, Badge
} from '@mui/material';
import { Visibility, Delete, Refresh, SupervisorAccount } from '@mui/icons-material';
import { projectService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function ProjectHistory({ onViewProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pegamos o isAdmin do contexto
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    loadProjects();
  }, [currentUser, isAdmin]); // Recarrega se usuário ou status de admin mudar

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // LÓGICA DE ADMIN:
      // Se for admin, busca 'all'.
      // Se não, busca o UID do usuário (ou 'anonymous').
      let targetUid = 'anonymous';
      
      if (isAdmin) {
          targetUid = 'all';
      } else if (currentUser) {
          targetUid = currentUser.uid;
      }

      console.log(`Carregando projetos. Modo Admin: ${isAdmin}. Target: ${targetUid}`);

      const response = await projectService.listProjects(targetUid);
      
      const list = Array.isArray(response.data) ? response.data : [];
      setProjects(list);
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
      setError("Não foi possível carregar o histórico.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await projectService.deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        alert("Erro ao excluir projeto.");
      }
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                Histórico de Simulações
            </Typography>
            {isAdmin && (
                <Chip 
                    icon={<SupervisorAccount />} 
                    label="Modo Admin: Visualizando Tudo" 
                    color="secondary" 
                    size="small" 
                    variant="outlined"
                />
            )}
        </Box>
        <Button startIcon={<Refresh />} onClick={loadProjects} variant="outlined" size="small">
            Atualizar
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>Projeto</strong></TableCell>
                  <TableCell><strong>Data</strong></TableCell>
                  <TableCell><strong>Complexidade</strong></TableCell>
                  <TableCell><strong>Investimento</strong></TableCell>
                  <TableCell><strong>ROI (Ano 1)</strong></TableCell>
                  <TableCell align="center"><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.length > 0 ? (
                    projects.map((project) => (
                    <TableRow key={project.id} hover>
                        <TableCell>
                            {project.project_name}
                            {/* Se for admin, mostra de quem é o projeto */}
                            {isAdmin && project.owner_uid !== currentUser?.uid && (
                                <Typography variant="caption" display="block" color="text.secondary">
                                    User ID: {project.owner_uid.slice(0, 8)}...
                                </Typography>
                            )}
                        </TableCell>
                        <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                        <Chip 
                            label={project.complexity_score?.classification || 'N/A'} 
                            color={project.complexity_score?.classification === 'HIGH' ? 'error' : project.complexity_score?.classification === 'MEDIUM' ? 'warning' : 'success'}
                            size="small" 
                        />
                        </TableCell>
                        <TableCell>{formatCurrency(project.results?.development_cost || 0)}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: project.results?.roi_year_1 > 0 ? 'green' : 'red' }}>
                        {project.results?.roi_year_1?.toFixed(1)}%
                        </TableCell>
                        <TableCell align="center">
                        <IconButton color="primary" onClick={() => onViewProject(project)}>
                            <Visibility />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(project.id)}>
                            <Delete />
                        </IconButton>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                                Nenhuma simulação encontrada.
                            </Typography>
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
      )}
    </Container>
  );
}