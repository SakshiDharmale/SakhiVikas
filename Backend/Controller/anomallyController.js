import { detectCurrentMonthAnomalies } from "../services/AnomalyDetect.js";

export async function getCurrentMonthAnomalies(req, res) {

    try {

        const userId = Number(req.user_id);

        const result =
            await detectCurrentMonthAnomalies(userId);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error(
            "Current month anomaly error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to analyze current month expenses."
        });
    }
}

