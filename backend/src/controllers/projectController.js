import ProjectService from '../services/projectService.js';

const projectService = new ProjectService();

/**
 * Controller para operações de projetos
 */
class ProjectController {
    /**
     * POST /api/projects - Cria um novo projeto
     */
    async createProject(req, res) {
        try {
            const { projectName, ownerUid, inputs, complexity } = req.body;

            // Validação básica
            if (!projectName || !inputs || !complexity) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: projectName, inputs, complexity',
                });
            }

            // Validar inputs
            if (!inputs.volume || !inputs.aht || !inputs.fteCost) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required inputs: volume, aht, fteCost',
                });
            }

            // Validar complexity
            if (
                complexity.numApplications === undefined ||
                !complexity.dataType ||
                !complexity.environment ||
                complexity.numSteps === undefined
            ) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required complexity fields',
                });
            }

            const project = await projectService.createProject({
                projectName,
                ownerUid,
                inputs,
                complexity,
            });

            res.status(201).json({
                success: true,
                data: project,
            });
        } catch (error) {
            console.error('Error in createProject:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    }

    /**
     * GET /api/projects/:id - Busca um projeto por ID
     */
    async getProject(req, res) {
        try {
            const { id } = req.params;
            const project = await projectService.getProject(id);

            res.status(200).json({
                success: true,
                data: project,
            });
        } catch (error) {
            console.error('Error in getProject:', error);

            if (error.message === 'Project not found') {
                return res.status(404).json({
                    success: false,
                    error: 'Project not found',
                });
            }

            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    }

    /**
     * GET /api/projects - Lista projetos de um usuário
     */
    async listProjects(req, res) {
        try {
            const { ownerUid } = req.query;

            if (!ownerUid) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing ownerUid query parameter',
                });
            }

            const projects = await projectService.listProjects(ownerUid);

            res.status(200).json({
                success: true,
                data: projects,
            });
        } catch (error) {
            console.error('Error in listProjects:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    }

    /**
     * PUT /api/projects/:id - Atualiza um projeto
     */
    async updateProject(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const project = await projectService.updateProject(id, updates);

            res.status(200).json({
                success: true,
                data: project,
            });
        } catch (error) {
            console.error('Error in updateProject:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    }

    /**
     * DELETE /api/projects/:id - Deleta um projeto
     */
    async deleteProject(req, res) {
        try {
            const { id } = req.params;
            const result = await projectService.deleteProject(id);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error('Error in deleteProject:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    }
}

export default new ProjectController();
