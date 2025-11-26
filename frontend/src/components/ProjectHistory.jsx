// frontend/src/components/ProjectHistory.jsx
import React, { useEffect, useState } from 'react';
import { 
  Container, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, Box, CircularProgress 
} from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import { projectService } from '../services/api';

export default function ProjectHistory({ onViewProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      // Como não temos login ainda, usamos 'anonymous' ou o ID que você usou no wizard
      const data = await projectService.listProjects('anonymous'); 
      setProjects(data);
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      await projectService.deleteProject(id);
      loadProjects(); // Recarrega a lista
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1a237e' }}>Histórico de Simulações</Typography>
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
            {projects.map((project) => (
              <TableRow key={project.id} hover>
                <TableCell>{project.project_name}</TableCell>
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
            ))}
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">Nenhum projeto encontrado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}