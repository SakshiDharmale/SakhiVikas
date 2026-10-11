import express from 'express';
import { login, register } from '../Controller/authController.js';
import verifytoken from '../Middleware/auth.js';
import { insertincome, getallincome, updateincome, deleteincome } from '../Controller/Incomecontroller.js';
import { insertExpense, getallexpense, updateExpense, deleteExpense } from '../Controller/ExpenseController.js';
import { getSpendingSummary } from '../services/analytics.js';
import { financialhealthScore } from '../services/analytics.js';
import {categorywiseAnalysis,getCategoryGroupAnalysis} from '../services/categoriesex.js';
import { getCurrentMonthAnomalies } from '../Controller/anomallyController.js';
import { getFinancialAnalytics } from '../services/analytics.js';
import {getCompleteFinancialAnalytics} from '../services/CompleteAnalytics.js';


const router = express.Router();


//authenticatication
router.post('/login', login);
router.post('/register', register);
//Income 
router.post('/AddIncome', verifytoken, insertincome);
router.get('/GetAllIncome', verifytoken, getallincome);
router.put('/UpdateIncome', verifytoken, updateincome);
router.delete('/DeleteIncome', verifytoken, deleteincome);
//expense
router.post('/AddExpense', verifytoken,insertExpense);
router.get('/GetAllExpense',verifytoken, getallexpense);
router.put('/UpdateExpense',verifytoken, updateExpense);
router.delete('/DeleteExpense',verifytoken, deleteExpense);
//analytics

router.get('/CategoryWiseAnalysis',verifytoken,async (req, res) => {
    try {
        const userId = req.user_id;
        const range = String(req.query.range ?? "monthly").trim().toLowerCase();
        const allowedRanges = ["daily", "weekly", "monthly", "yearly"];
        if (!allowedRanges.includes(range)) {
            return res.status(400).json({
                success: false,
                message: "Invalid range. Allowed values are daily, weekly, monthly, yearly"
            });
        }

        const analysis = await categorywiseAnalysis(userId, range);
        return res.status(200).json({ success: true, data: analysis });
    } catch (error) {
        console.error("Category-wise analysis error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to calculate category-wise analysis",
            error: error.message
        });
    }
});
//anomaly
router.get('/CurrentMonthAnomalies', verifytoken, getCurrentMonthAnomalies);
router.get('/getSpendingSummary',verifytoken,getSpendingSummary);

router.get('/getFinancialAnalytics',verifytoken,async (req, res) => {
     try
    {
       const userId = req.user_id;
       const score = await getFinancialAnalytics(userId,"monthly");
         return res.status(200).json({
           success: true,
          data: {
                score
           }
        });

    } 
    catch (error) {

         console.error(
         "Errror calculating analytics",error
        );

        return res.status(500).json({
          success: false,
        message: "Unable to calculate financial analytics"
       });
    }
});

router.get('/getAlAnalytics', verifytoken, async (req, res) => {
    try {
        const range = String(req.body.range ?? "monthly").trim().toLowerCase();
        const allowedRanges = ["daily", "weekly", "monthly", "yearly"];
        if (!allowedRanges.includes(range)) {
            return res.status(400).json({
                success: false,
                message: "Invalid range. Allowed values are daily, weekly, monthly, yearly"
            });
        }

        const requestedLanguage = String(req.body.language ?? "English").trim();
        const language = ["English", "Hindi", "Marathi"].find(
            (supported) => supported.toLowerCase() === requestedLanguage.toLowerCase()
        ) ?? "English";
        const data = await getCompleteFinancialAnalytics(req.user_id, range, language);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Complete financial analytics error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to calculate complete financial analytics",
            error: error.message
        });
    }
});

router.get('/financialHealthScore', verifytoken, async (req, res) => {
    try {
        const range = String(req.query.range ?? 'monthly').trim().toLowerCase();
        const allowedRanges = ['daily', 'weekly', 'monthly', 'yearly'];
        if (!allowedRanges.includes(range)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid range. Allowed values are daily, weekly, monthly, yearly'
            });
        }

        const score = await financialhealthScore(req.user_id, range);
        return res.status(200).json({ success: true, data: { score } });
    } catch (error) {
        console.error('Financial health score error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to calculate financial health score'
        });
    }
});

router.get('/category-wise-analysis', verifytoken,async (req, res) => {

 try {
         const userId = req.user_id;
         const range = String(req.query.range ?? "monthly").trim().toLowerCase();
const analysis = await categorywiseAnalysis(userId, range);
 return res.status(200).json({
            success: true,
            data: analysis
        });

     } catch (error) {

         console.error(
            "Category-wise analysis error:",
            error
        );

        return res.status(500).json({
            success: false,
message: "Unable to calculate category-wise analysis"
        });
    }
});

  
export default router;          
