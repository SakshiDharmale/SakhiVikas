 
 const {getCompleteFinancialAnalytics}=require('../services/CompleteAnalytics');
 
 export async function AnalyticsAl(req, res) {

    try {

        const userId = req.user_id;
        const language = req.body || "English";

        // Get ALL backend analytics
        const analytics =
            await getCompleteFinancialAnalytics(userId);

        // AI only explains the backend results
        

        return res.status(200).json({
            success: true,
            data: {
                analytics,
                
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate financial analysis"
        });
    }
};