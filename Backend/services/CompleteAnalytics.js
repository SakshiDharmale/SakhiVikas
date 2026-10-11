import {
    getFinancialAnalytics,
    getSpendingPattern,
    financialhealthScore
} from "./analytics.js";
import { categorywiseAnalysis } from "./categoriesex.js";
import { detectCurrentMonthAnomalies } from "./AnomalyDetect.js";
import { generateFinancialadvice } from "./AIFinanceAdvisor.js";

export async function getCompleteFinancialAnalytics(userId, range = "monthly", language) {
    const [financial, spendingPattern, categoryAnalysis, health, anomalies] =
        await Promise.all([
            getFinancialAnalytics(userId, range),
            getSpendingPattern(userId, range),
            categorywiseAnalysis(userId, range),
            financialhealthScore(userId, range),
            detectCurrentMonthAnomalies(userId)
        ]);

    const analytics = {
        range,
        financial,
        spendingPattern,
        categoryAnalysis,
        financialHealth: health,
        anomalies
    };

    let personalizedSuggestions;
    try {
        personalizedSuggestions = await generateFinancialadvice(analytics, language);
    } catch (error) {
        console.error('Gemini financial advice unavailable:', error);
        const unavailableMessages = {
            hindi: 'AI सुझाव अभी उपलब्ध नहीं हैं। आपके वित्तीय विश्लेषण नीचे दिए गए हैं।',
            marathi: 'AI सूचना सध्या उपलब्ध नाहीत. तुमचे आर्थिक विश्लेषण खाली दिले आहे.',
            english: 'AI suggestions are temporarily unavailable. Your financial analytics are still available.'
        };
        personalizedSuggestions = unavailableMessages[String(language ?? 'English').toLowerCase()] ?? unavailableMessages.english;
    }

    return { ...analytics, personalizedSuggestions };
}
