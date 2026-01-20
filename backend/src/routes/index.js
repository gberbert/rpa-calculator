import express from 'express';
import projectController from '../controllers/projectController.js';
import settingsController from '../controllers/settingsController.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'RPA ROI Navigator API is running',
        timestamp: new Date().toISOString(),
    });
});

// Projects routes
router.post('/projects', projectController.createProject.bind(projectController));
router.get('/projects/:id', projectController.getProject.bind(projectController));
router.get('/projects', projectController.listProjects.bind(projectController));
router.put('/projects/:id', projectController.updateProject.bind(projectController));
router.delete('/projects/:id', projectController.deleteProject.bind(projectController));

// Settings routes
router.get('/settings', settingsController.getSettings.bind(settingsController));
router.put('/settings', settingsController.updateSettings.bind(settingsController));

// User routes
router.use('/users', userRoutes);

export default router;
