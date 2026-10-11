import db from '../db.js';


const runQuery = (sql, values = []) =>
    new Promise((resolve, reject) => {
        db.query(sql, values, (error, rows) => {
            if (error) reject(error);
            else resolve(rows);
        });
    });

const HISTORY_MONTHS = 6;
const Z_THRESHOLD = 3;
const MIN_HISTORY_MONTHS = 3;

export async function detectCurrentMonthAnomalies(userId) {

    
    // 1. Get current month
   
    const currentMonth = new Date()
        .toISOString()
        .slice(0, 7); // YYYY-MM

    const currentMonthStart = `${currentMonth}-01`;

    // -----------------------------------------
    // 2. Get current month category totals
    // -----------------------------------------

    const currentRows = await runQuery(
        `
        SELECT
            categories.name AS category,
            SUM(expenses.amount) AS amount
        FROM expenses
        JOIN categories ON categories.id = expenses.category_id
        WHERE expenses.user_id = ?
          AND DATE_FORMAT(expenses.expense_date, '%Y-%m') = ?
        GROUP BY categories.name
        `,
        [userId, currentMonth]
    );

    if (currentRows.length === 0) {
        return [];
    }

    const results = [];

   
    // 3. Analyse every current-month category
    

    for (const currentRow of currentRows) {

        const category = currentRow.category;
        const currentAmount = Number(currentRow.amount);

       
        // 4. Get previous 6 months of same category
       

        const historyRows = await runQuery(
            `
            SELECT
                DATE_FORMAT(expenses.expense_date, '%Y-%m') AS month,
                SUM(expenses.amount) AS amount
            FROM expenses
            JOIN categories ON categories.id = expenses.category_id
            WHERE expenses.user_id = ?
              AND categories.name = ?
              AND expenses.expense_date < ?
              AND expenses.expense_date >= DATE_SUB(
                    ?,
                    INTERVAL ? MONTH
                  )
            GROUP BY
                DATE_FORMAT(expenses.expense_date, '%Y-%m')
            ORDER BY month ASC
            `,
            [
                userId,
                category,
                currentMonthStart,
                currentMonthStart,
                HISTORY_MONTHS
            ]
        );

        
        // 5. Check history
        
        if (historyRows.length < MIN_HISTORY_MONTHS) {

            results.push({
                category,
                currentMonth,
                currentAmount,
                status: "INSUFFICIENT_DATA",
                isAnomaly: false,
                message:
                    "Not enough previous months to detect an anomaly."
            });

            continue;
        }


        // 6. Historical amounts
        

        const historicalAmounts =
            historyRows.map(row =>
                Number(row.amount)
            );

        
        // 7. Mean
      

        const mean =
            historicalAmounts.reduce(
                (sum, amount) => sum + amount,
                0
            ) / historicalAmounts.length;

        
        // 8. Standard deviation
       

        const variance =
            historicalAmounts.reduce(
                (sum, amount) =>
                    sum + Math.pow(amount - mean, 2),
                0
            ) / historicalAmounts.length;

        const standardDeviation =
            Math.sqrt(variance);

       
        // 9. Handle zero standard deviation
  

        if (standardDeviation === 0) {

            const isAnomaly =
                currentAmount !== mean;

            results.push({
                category,
                currentMonth,
                currentAmount,
                historicalAverage:
                    Number(mean.toFixed(2)),
                standardDeviation: 0,
                zScore: null,
                isAnomaly,
                status:
                    isAnomaly
                        ? "ANOMALY"
                        : "NORMAL"
            });

            continue;
        }

        // -----------------------------------------
        // 10. Z-score
        // -----------------------------------------

        const zScore =
            (currentAmount - mean) /
            standardDeviation;

       
        // 11. Detect anomaly
      
        const isAnomaly =
            Math.abs(zScore) > Z_THRESHOLD;

        results.push({
            category,
            currentMonth,
            currentAmount,

            historicalAverage:
                Number(mean.toFixed(2)),

            standardDeviation:
                Number(standardDeviation.toFixed(2)),

            zScore:
                Number(zScore.toFixed(2)),

            threshold: Z_THRESHOLD,

            isAnomaly,

            status:
                isAnomaly
                    ? "ANOMALY"
                    : "NORMAL",

            message:
                isAnomaly
                    ? `${category} spending is unusually high compared with previous months.`
                    : `${category} spending is within your normal spending pattern.`
        });
    }

    return results;
}

