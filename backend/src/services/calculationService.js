import { getFirestore } from '../config/firebase.js';

/**
 * Serviço de Cálculo de Complexidade
 * Implementa a Matriz de Complexidade baseada em scoring
 */
class ComplexityService {
    /**
     * Calcula a pontuação de complexidade baseada nos critérios
     * @param {Object} complexity - Objeto com os critérios de complexidade
     * @returns {Object} - { totalPoints, classification }
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
            case 'structured': // Excel, CSV
                totalPoints += 1;
                break;
            case 'text': // E-mail, Texto
                totalPoints += 2;
                break;
            case 'ocr': // Imagem, OCR
                totalPoints += 5;
                break;
            default:
                totalPoints += 1;
        }

        // 3. Ambiente
        const environment = complexity.environment || 'web';
        switch (environment) {
            case 'web': // Web/Local
                totalPoints += 1;
                break;
            case 'sap': // SAP/Mainframe
                totalPoints += 2;
                break;
            case 'citrix': // Citrix/Remoto
                totalPoints += 4;
                break;
            default:
                totalPoints += 1;
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

    /**
     * Retorna as horas base de desenvolvimento e análise
     * @param {String} classification - LOW, MEDIUM, HIGH
     * @returns {Object} - { devHours, analystHours, totalHours }
     */
    getBaselineHours(classification) {
        const baselines = {
            LOW: { devHours: 80, analystHours: 24 },
            MEDIUM: { devHours: 160, analystHours: 48 },
            HIGH: { devHours: 320, analystHours: 96 },
        };

        const baseline = baselines[classification] || baselines.MEDIUM;
        return {
            ...baseline,
            totalHours: baseline.devHours + baseline.analystHours,
        };
    }
}

/**
 * Serviço de Cálculo Financeiro
 * Implementa as fórmulas de ROI, Payback e custos
 */
class FinancialService {
    constructor() {
        this.db = getFirestore();
    }

    /**
     * Busca as taxas globais do Firestore
     * @returns {Object} - Taxas e configurações globais
     */
    async getGlobalRates() {
        try {
            const settingsDoc = await this.db.collection('settings').doc('global_config').get();

            if (!settingsDoc.exists) {
                // Retorna valores padrão se não existir
                return {
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
            }

            return settingsDoc.data();
        } catch (error) {
            console.error('Error fetching global rates:', error);
            throw new Error('Failed to fetch global configuration');
        }
    }

    /**
     * Calcula o custo AS-IS (situação atual)
     * @param {Object} inputs - { volume, aht, fteCost, errorRate }
     * @returns {Number} - Custo anual AS-IS
     */
    calculateAsIsCost(inputs) {
        const { volume, aht, fteCost, errorRate = 0 } = inputs;

        // Custo por minuto do FTE (assumindo 160h/mês = 9600min/mês)
        const costPerMinute = fteCost / 9600;

        // Custo AS-IS Anual = (Volume * AHT * 12) * Custo_Minuto * (1 + Taxa_Erro)
        const asIsCost = (volume * aht * 12) * costPerMinute * (1 + errorRate / 100);

        return Math.round(asIsCost * 100) / 100;
    }

    /**
     * Calcula o custo de desenvolvimento
     * @param {Object} hours - { devHours, analystHours }
     * @param {Object} rates - { dev_hourly, analyst_hourly }
     * @returns {Number} - Custo total de desenvolvimento
     */
    calculateDevelopmentCost(hours, rates) {
        const devCost = hours.devHours * rates.dev_hourly;
        const analystCost = hours.analystHours * rates.analyst_hourly;

        return Math.round((devCost + analystCost) * 100) / 100;
    }

    /**
     * Calcula o custo TO-BE (com automação)
     * @param {Object} params - { developmentCost, rates, exceptionRate }
     * @returns {Object} - Breakdown do custo TO-BE
     */
    calculateToBeCost(params) {
        const { developmentCost, rates, exceptionRate = 5 } = params;

        // Custo de licenças anual
        const licenseCost = rates.license_annual;

        // Custo de infraestrutura anual
        const infraCost = rates.infra_annual;

        // Manutenção (15% do custo de desenvolvimento)
        const maintenanceCost = developmentCost * 0.15;

        // Custo de exceções manuais (% do volume que ainda precisa intervenção)
        // Simplificado: assumimos que é uma % pequena do custo AS-IS
        const exceptionCost = 0; // Pode ser parametrizado futuramente

        const totalToBeCost = licenseCost + infraCost + maintenanceCost + exceptionCost;

        return {
            licenseCost: Math.round(licenseCost * 100) / 100,
            infraCost: Math.round(infraCost * 100) / 100,
            maintenanceCost: Math.round(maintenanceCost * 100) / 100,
            exceptionCost: Math.round(exceptionCost * 100) / 100,
            totalToBeCost: Math.round(totalToBeCost * 100) / 100,
        };
    }

    /**
     * Calcula o ROI do primeiro ano
     * @param {Number} asIsCost - Custo AS-IS anual
     * @param {Number} toBeCost - Custo TO-BE anual
     * @param {Number} developmentCost - Custo de desenvolvimento
     * @returns {Number} - ROI em percentual
     */
    calculateROI(asIsCost, toBeCost, developmentCost) {
        // ROI = ((Economia - Investimento) / Investimento) * 100
        const savings = asIsCost - toBeCost;
        const roi = ((savings - developmentCost) / developmentCost) * 100;

        return Math.round(roi * 100) / 100;
    }

    /**
     * Calcula o período de payback em meses
     * @param {Number} developmentCost - Investimento inicial
     * @param {Number} monthlySavings - Economia mensal
     * @returns {Number} - Meses até payback
     */
    calculatePayback(developmentCost, monthlySavings) {
        if (monthlySavings <= 0) return null; // Nunca haverá payback

        const months = developmentCost / monthlySavings;
        return Math.round(months * 10) / 10;
    }

    /**
     * Calcula todos os indicadores financeiros
     * @param {Object} inputs - Inputs AS-IS
     * @param {Object} complexity - Critérios de complexidade
     * @returns {Object} - Todos os resultados financeiros
     */
    async calculateFullROI(inputs, complexity) {
        // 1. Buscar taxas globais
        const config = await this.getGlobalRates();

        // 2. Calcular complexidade
        const complexityService = new ComplexityService();
        const complexityScore = complexityService.calculateComplexityScore(complexity);
        const hours = complexityService.getBaselineHours(complexityScore.classification);

        // 3. Calcular custo de desenvolvimento
        const developmentCost = this.calculateDevelopmentCost(hours, config.rates);

        // 4. Calcular custo AS-IS
        const asIsCost = this.calculateAsIsCost(inputs);

        // 5. Calcular custo TO-BE
        const toBeCostBreakdown = this.calculateToBeCost({
            developmentCost,
            rates: config.rates,
        });

        // 6. Calcular ROI
        const roi = this.calculateROI(asIsCost, toBeCostBreakdown.totalToBeCost, developmentCost);

        // 7. Calcular Payback
        const annualSavings = asIsCost - toBeCostBreakdown.totalToBeCost;
        const monthlySavings = annualSavings / 12;
        const paybackMonths = this.calculatePayback(developmentCost, monthlySavings);

        return {
            complexity: {
                score: complexityScore.totalPoints,
                classification: complexityScore.classification,
                hours: hours,
            },
            costs: {
                asIs: {
                    annual: asIsCost,
                    monthly: Math.round((asIsCost / 12) * 100) / 100,
                },
                development: developmentCost,
                toBe: {
                    ...toBeCostBreakdown,
                    annual: toBeCostBreakdown.totalToBeCost,
                    monthly: Math.round((toBeCostBreakdown.totalToBeCost / 12) * 100) / 100,
                },
            },
            roi: {
                year1: roi,
                annualSavings: Math.round(annualSavings * 100) / 100,
                monthlySavings: Math.round(monthlySavings * 100) / 100,
                paybackMonths: paybackMonths,
            },
        };
    }
}

export { ComplexityService, FinancialService };
