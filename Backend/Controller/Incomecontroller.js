import db from '../db.js';
console.log("db is:", db);
console.log("keys:", Object.keys(db || {}));

const runQuery = (sql, values = []) =>
    new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

export async function insertincome(req, res) {
    try {
        const user_id = req.user_id;
        const { description, category, amount, date } = req.body;

        if (!Number.isInteger(Number(user_id)) || Number(user_id) <= 0) {
            return res.status(401).json({
                success: false,
                message: "User identity missing or invalid; please log in again"
            });
        }

        if (!description || !category || !amount || !date) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Required"
            });
        }

        // Find category (result is the rows array directly, not [rows])
        const rows = await runQuery(
            "SELECT id FROM categories WHERE name = ?",
            [category]
        );

        let categoryId;

        if (rows.length > 0) {
            categoryId = rows[0].id;
        } else {
            const newCategory = await runQuery(
                "INSERT INTO categories (name) VALUES (?)",
                [category]
            );
            categoryId = newCategory.insertId;
        }

        await runQuery(
            `INSERT INTO income (user_id, category_id, description, amount, date)
             VALUES (?, ?, ?, ?, ?)`,
            [user_id, categoryId, description, amount, date]
        );

        return res.status(201).json({
            success: true,
            message: "Income added successfully"
        });

    } catch (error) {
        console.error("Income Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error adding income",
            error: error.message
        });
    }
};

    //get income
export async function getallincome(req,res) {
    const user_id = req.user_id;

    if (!Number.isInteger(Number(user_id)) || Number(user_id) <= 0) {
        return res.status(401).json({
            success: false,
            message: "User identity missing or invalid; please log in again"
        });
    }

    try {
        const rows = await runQuery(
            "SELECT * FROM income WHERE user_id = ? ORDER BY date DESC",
            [user_id]
        );

        return res.status(200).json({
            success: true,
            income: rows
        });
    } catch (error) {
        console.error("Get income error:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching income",
            error: error.message
        });
    }
};

export async function updateincome(req,res) {
    const user_id = req.user_id;
    const amount = Number(req.body?.amount);

    if (!Number.isInteger(Number(user_id)) || Number(user_id) <= 0) {
        return res.status(401).json({
            success: false,
            message: "User identity missing or invalid; please log in again"
        });
    }

    if (req.body?.amount === undefined || !Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "A positive amount is required"
        });
    }

    try {
        const result = await runQuery(
            "UPDATE income SET amount = ? WHERE user_id = ?",
            [amount, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No income records found for this user"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Income updated successfully",
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error("Update income error:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating income",
            error: error.message
        });
    }
};

export async function deleteincome(req,res) {
    const user_id=req.user_id;
    try{
        
        await runQuery(
        "delete from income where user_id=?",
        [user_id]
        );
                
        res.status(201).json({
        message: "Income deleted successfully",
                            
                            
        });
                
        } catch (error) {
          console.error(error);
                
          res.status(500).json({
          message: "Error deleting income"
           });
            }
        };
