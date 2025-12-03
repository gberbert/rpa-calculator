import { getFirestore } from '../config/firebase.js';

/**
 * Serviço de Cálculo de Complexidade
 * Implementa a Matriz de Complexidade baseada em scoring
 */
class ComplexityService {
    /**
     * Calcula a pontuação de complexidade baseada nos critérios
     */
    calculateComplexityScore(complexity) {
        let totalPoints = 0;

        // 1. Número de Aplicações
        const numApps = complexity.numApplications || 0;
        if (numApps <= 2) totalPoints += 1;
        else if (numApps <= 4) totalPoints += 2;
        else totalPoints += 3;

        // 2. Tipo de Dados
        const dataType = complexity.dataType || 'structured';
        switch (dataType) {
            case 'structured': totalPoints += 1; break;
            case 'text': totalPoints += 2; break;
            case 'ocr': totalPoints += 5; break;
            default: totalPoints += 1;
        }

        // 3. Ambiente
        const environment = complexity.environment || 'web';
        switch (environment) {
            case 'web': totalPoints += 1; break;
            case 'sap': totalPoints += 2; break;
            case 'citrix': totalPoints += 4; break;
            default: totalPoints += 1;
        }

        // 4. Regras/Passos
        const numSteps = complexity.numSteps || 0;
        if (numSteps < 20) totalPoints += 1;
        else if (numSteps <= 50) totalPoints += 3;
        else totalPoints += 5;

        // Classificação
        let classification = 'LOW';
        if (totalPoints >= 12) classification = 'HIGH';
        else if (totalPoints >= 7) classification = 'MEDIUM';

        return {
            totalPoints,
            classification,
        };
    }
}

/**
 * Serviço de Cálculo Financeiro
 * Implementa as fórmulas de ROI, Payback e custos (Versão Enterprise)
 */
class FinancialService {
    constructor() {
        this.db = getFirestore();
        this.cachedRates = null;
        this.lastCacheTime = 0;
        this.CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache
    }

    /**
     * Busca as taxas globais do Firestore (com Cache)
     */
    async getGlobalRates() {
        const now = Date.now();
        if (this.cachedRates && (now - this.lastCacheTime < this.CACHE_TTL)) {
            console.log('Using cached global rates');
            return this.cachedRates;
        }

        try {
            const settingsDoc = await this.db.collection('settings').doc('global_config').get();
            let data;

            if (!settingsDoc.exists) {
                // Fallback de segurança se o banco estiver vazio
                data = {
                    team_composition: [{ role: 'Dev Padrão', rate: 120.0, share: 1.0 }],
                    infra_costs: { rpa_license_annual: 15000.0, virtual_machine_annual: 5000.0 },
                    baselines: { low: 100, medium: 240, high: 480 }
                };
            } else {
                data = settingsDoc.data();
            }

            this.cachedRates = data;
            this.lastCacheTime = now;
            return data;

        } catch (error) {
            console.error('Error fetching global rates:', error);
            throw new Error('Failed to fetch global configuration');
        }
    }

    /**
     * Calcula o custo AS-IS (situação atual)
     */
    calculateAsIsCost(inputs) {
        const { volume, aht, fteCost, errorRate = 0 } = inputs;
        // Custo por minuto do FTE (assumindo 160h/mês = 9600min/mês)
        const costPerMinute = fteCost / 9600;
        // Custo AS-IS Anual
        const asIsCost = (volume * aht * 12) * costPerMinute * (1 + errorRate / 100);
        return Math.round(asIsCost * 100) / 100;
    }

    /**
     * Calcula o custo de desenvolvimento baseado no Mix da Squad
     */
    calculateDevelopmentCost(totalHours, teamComposition) {
        // Fallback se não houver composição definida
        if (!teamComposition || teamComposition.length === 0) {
            return totalHours * 120; // Taxa padrão de segurança
        }

        // Custo Blended (Misturado) = Soma (Taxa * %Participação)
        let blendedHourlyRate = 0;
        teamComposition.forEach(member => {
            blendedHourlyRate += (member.rate * member.share);
        });

        const totalCost = totalHours * blendedHourlyRate;
        return Math.round(totalCost * 100) / 100;
    }

    /**
     * Calcula o período de payback em meses
     */
    calculatePayback(developmentCost, monthlySavings) {
        if (monthlySavings <= 0) return null; // Nunca haverá payback
        const months = developmentCost / monthlySavings;
        return Math.round(months * 10) / 10;
    }

    /**
     * Calcula todos os indicadores financeiros (Enterprise)
     */
    async calculateFullROI(inputs, complexity) {
        // 1. Carregar configurações do banco
        const config = await this.getGlobalRates();

        // 2. Calcular complexidade e horas
        const complexityService = new ComplexityService();
        const complexityScore = complexityService.calculateComplexityScore(complexity);

        // Mapeia a classificação para horas (fallback se não existir no banco)
        const baselines = config.baselines || { low: 100, medium: 240, high: 480 };
        const totalHours = baselines[complexityScore.classification.toLowerCase()];

        // 3. Custo de Desenvolvimento (Squad Ponderada)
        // Garante fallback se team_composition não existir
        const teamComp = config.team_composition || [{ role: 'Dev', rate: 120, share: 1 }];
        const developmentCost = this.calculateDevelopmentCost(totalHours, teamComp);

        // 4. Custo AS-IS (Atual)
        const asIsCost = this.calculateAsIsCost(inputs);

        // 5. Custo TO-BE (Licenças + Infra + Manutenção)
        // Garante fallback de custos de infra
        const infraCosts = config.infra_costs || {
            rpa_license_annual: 15000,
            virtual_machine_annual: 5000,
            database_annual: 0
        };

        const annualInfraCost = Object.values(infraCosts).reduce((a, b) => a + b, 0);
        const maintenanceCost = developmentCost * 0.15; // 15% do dev para sustentação
        const totalToBeCost = annualInfraCost + maintenanceCost;

        // 6. ROI e Payback
        const annualSavings = asIsCost - totalToBeCost;
        const roi = ((annualSavings - developmentCost) / developmentCost) * 100;
        const monthlySavings = annualSavings / 12;
        const paybackMonths = this.calculatePayback(developmentCost, monthlySavings);

        return {
            complexity: {
                score: complexityScore.totalPoints,
                classification: complexityScore.classification,
                hours: { totalHours }
            },
            costs: {
                asIs: {
                    annual: asIsCost,
                    monthly: Math.round((asIsCost / 12) * 100) / 100
                },
                development: developmentCost,
                toBe: {
                    licenseCost: infraCosts.rpa_license_annual,
                    infraCost: infraCosts.virtual_machine_annual + (infraCosts.database_annual || 0),
                    maintenanceCost,
                    totalToBeCost,
                    annual: totalToBeCost
                },
            },
            roi: {
                year1: Math.round(roi * 100) / 100,
                annualSavings: Math.round(annualSavings * 100) / 100,
                monthlySavings: Math.round(monthlySavings * 100) / 100,
                paybackMonths,
            },
        };
    }
}

export { ComplexityService, FinancialService };