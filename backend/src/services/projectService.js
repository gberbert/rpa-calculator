import { getFirestore } from '../config/firebase.js';
import { FinancialService } from './calculationService.js';

/**
 * Serviço para gerenciar projetos no Firestore
 */
class ProjectService {
    constructor() {
        this.db = getFirestore();
        this.financialService = new FinancialService();
    }

    /**
     * Cria um novo projeto/simulação
     * @param {Object} projectData - Dados do projeto
     * @returns {Object} - Projeto criado com ID
     */
    async createProject(projectData) {
        try {
            const { projectName, ownerUid, inputs, complexity } = projectData;

            // Calcular todos os indicadores
            const results = await this.financialService.calculateFullROI(inputs, complexity);

            // Estrutura do documento
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
                complexity_score: {
                    total_points: results.complexity.score,
                    classification: results.complexity.classification,
                    hours: results.complexity.hours,
                },
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

            // Salvar no Firestore
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

    /**
     * Busca um projeto por ID
     * @param {String} projectId - ID do projeto
     * @returns {Object} - Dados do projeto
     */
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

    /**
     * Lista todos os projetos de um usuário
     * @param {String} ownerUid - ID do usuário
     * @returns {Array} - Lista de projetos
     */
    async listProjects(ownerUid) {
        try {
            const snapshot = await this.db
                .collection('projects')
                .where('owner_uid', '==', ownerUid)
                .orderBy('created_at', 'desc')
                .get();

            const projects = [];
            snapshot.forEach((doc) => {
                projects.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            return projects;
        } catch (error) {
            console.error('Error listing projects:', error);
            throw new Error('Failed to list projects');
        }
    }

    /**
     * Atualiza um projeto existente
     * @param {String} projectId - ID do projeto
     * @param {Object} updates - Dados a atualizar
     * @returns {Object} - Projeto atualizado
     */
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

    /**
     * Deleta um projeto
     * @param {String} projectId - ID do projeto
     */
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
