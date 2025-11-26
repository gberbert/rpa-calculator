import { getFirestore } from '../config/firebase.js';

/**
 * Controller para configurações globais
 */
class SettingsController {
    constructor() {
        this.db = getFirestore();
    }

    /**
     * GET /api/settings - Busca configurações globais
     */
    async getSettings(req, res) {
        try {
            const doc = await this.db.collection('settings').doc('global_config').get();

            if (!doc.exists) {
                // Retorna configurações padrão
                const defaultSettings = {
                    rates: {
                        dev_hourly: 120.0,
                        analyst_hourly: 150.0,
                        infra_annual: 5000.0,
                        license_annual: 15000.0,
                    },
                    baselines: {
                        low: 104,
                        medium: 208,
                        high: 416,
                    },
                };

                return res.status(200).json({
                    success: true,
                    data: defaultSettings,
                });
            }

            res.status(200).json({
                success: true,
                data: doc.data(),
            });
        } catch (error) {
            console.error('Error fetching settings:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    }

    /**
     * PUT /api/settings - Atualiza configurações globais
     */
    async updateSettings(req, res) {
        try {
            const updates = req.body;

            await this.db.collection('settings').doc('global_config').set(updates, { merge: true });

            const updatedDoc = await this.db.collection('settings').doc('global_config').get();

            res.status(200).json({
                success: true,
                data: updatedDoc.data(),
            });
        } catch (error) {
            console.error('Error updating settings:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error',
            });
        }
    }
}

export default new SettingsController();
