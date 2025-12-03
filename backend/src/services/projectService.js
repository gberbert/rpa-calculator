// backend/src/services/projectService.js
import { getFirestore } from '../config/firebase.js';
import { FinancialService } from './calculationService.js';

class ProjectService {
    constructor() {
        this.db = getFirestore();
        this.financialService = new FinancialService();
    }

    async createProject(projectData) {
        try {
            const { projectName, ownerUid, inputs, complexity, strategic, maintenance } = projectData;
            const results = await this.financialService.calculateFullROI(inputs, complexity, strategic, maintenance);

            const project = {
                project_name: projectName,
                owner_uid: ownerUid || 'anonymous',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                inputs_as_is: {
                    volume: inputs.volume,
                    aht: inputs.aht,
                    fte_cost: inputs.fteCost,
                    error_rate: inputs.errorRate || 0,
                },
                complexity_input: complexity,
                strategic_input: strategic || {},
                maintenance_input: maintenance || {},
                complexity_score: {
                    total_points: results.complexity.score,
                    classification: results.complexity.classification,
                    hours: results.complexity.hours,
                },
                strategic_analysis: results.strategic || {},
                maintenance_analysis: results.maintenance || {},
                results: {
                    development_cost: results.costs.development,
                    as_is_cost_annual: results.costs.asIs.annual,
                    to_be_cost_annual: results.costs.toBe.annual,
                    roi_year_1: results.roi.year1,
                    annual_savings: results.roi.annualSavings,
                    monthly_savings: results.roi.monthlySavings,
                    payback_months: results.roi.paybackMonths,
                    cost_breakdown: results.costs.toBe,
                },
            };

            const docRef = await this.db.collection('projects').add(project);
            return {
                id: docRef.id,
                ...project,
            };
        } catch (error) {
            console.error('Error creating project:', error);
            throw new Error('Failed to create project');
        }
    }

    async getProject(projectId) {
        try {
            const doc = await this.db.collection('projects').doc(projectId).get();
            if (!doc.exists) {
                throw new Error('Project not found');
            }
            return {
                id: doc.id,
                ...doc.data(),
            };
        } catch (error) {
            console.error('Error fetching project:', error);
            throw error;
        }
    }

    // --- CORREÇÃO PARA ADMIN VIEW ---
    async listProjects(ownerUid, limit = 50) {
        try {
            let query = this.db.collection('projects');

            // Se o UID for 'all', NÃO filtramos (traz tudo).
            // Se for um UID específico, filtramos.
            if (ownerUid && ownerUid !== 'all') {
                query = query.where('owner_uid', '==', ownerUid);
            }

            // Tenta usar ordenação e limite do banco de dados para performance
            try {
                // Nota: Para consultas com .where() e .orderBy(), o Firestore exige um índice composto.
                // Se não existir, vai cair no catch e faremos a ordenação em memória (fallback).
                const optimizedQuery = query.orderBy('created_at', 'desc').limit(limit);
                const snapshot = await optimizedQuery.get();

                const projects = [];
                snapshot.forEach((doc) => {
                    projects.push({ id: doc.id, ...doc.data() });
                });
                return projects;

            } catch (indexError) {
                console.warn('Index missing for optimized query, falling back to memory sort:', indexError.message);

                // Fallback: Busca sem ordenação
                const snapshot = await query.get();

                const projects = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    projects.push({
                        id: doc.id,
                        ...data,
                    });
                });

                return projects.sort((a, b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    return dateB - dateA; // Mais recente primeiro
                });
            }

        } catch (error) {
            console.error('Error listing projects:', error);
            throw new Error(`Failed to list projects: ${error.message}`);
        }
    }

    async updateProject(projectId, updates) {
        try {
            const updateData = {
                ...updates,
                updated_at: new Date().toISOString(),
            };
            await this.db.collection('projects').doc(projectId).update(updateData);
            return await this.getProject(projectId);
        } catch (error) {
            console.error('Error updating project:', error);
            throw new Error('Failed to update project');
        }
    }

    async deleteProject(projectId) {
        try {
            await this.db.collection('projects').doc(projectId).delete();
            return { success: true, message: 'Project deleted successfully' };
        } catch (error) {
            console.error('Error deleting project:', error);
            throw new Error('Failed to delete project');
        }
    }
}

export default ProjectService;