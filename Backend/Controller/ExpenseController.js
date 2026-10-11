    import db from '../db.js';
     
     const runQuery = (sql, values = []) =>
         new Promise((resolve, reject) => {
             db.query(sql, values, (err, result) => {
                 if (err) reject(err);
                 else resolve(result);
             });
         });
     
     export async function insertExpense(req, res) {
         try {
             const user_id = req.user_id;
            const body = req.body ?? {};
            const category = body.category;
            const categoryIdInput = body.category_id ?? body.categoryId;
            const amount = Number(body.amount);
            const date = body.date ?? body.expense_date ?? body.expenseDate;
     
             if (!Number.isInteger(Number(user_id)) || Number(user_id) <= 0) {
                 return res.status(401).json({
                     success: false,
                     message: "User identity missing or invalid; please log in again"
                 });
             }
     
            if ((!category && !categoryIdInput) || body.amount === undefined || body.amount === "" || !Number.isFinite(amount) || amount <= 0 || !date) {
                return res.status(400).json({
                    success: false,
                    message: "category (or category_id), a positive amount, and date (or expense_date) are required"
                });
            }
     
             // Find category (result is the rows array directly, not [rows])
            let categoryId;
            if (categoryIdInput !== undefined && categoryIdInput !== null && categoryIdInput !== "") {
                categoryId = Number(categoryIdInput);
                if (!Number.isInteger(categoryId) || categoryId <= 0) {
                    return res.status(400).json({ success: false, message: "category_id must be a positive integer" });
                }
            } else {
                const rows = await runQuery(
                    "SELECT id FROM categories WHERE name = ?",
                    [category]
                );

                if (rows.length > 0) {
                    categoryId = rows[0].id;
                } else {
                    const newCategory = await runQuery(
                        "INSERT INTO categories (name) VALUES (?)",
                        [category]
                    );
                    categoryId = newCategory.insertId;
                }
            }
     
             await runQuery(
                `INSERT INTO expenses (user_id, category_id, amount, expense_date)
                 VALUES (?, ?, ?, ?)`,
                 [user_id, categoryId, amount, date]
             );
     
             return res.status(201).json({
                 success: true,
                 message: "Expense added successfully"
             });
     
         } catch (error) {
             console.error("Expense Error:", error);
             return res.status(500).json({
                 success: false,
                 message: "Error adding expense",
                 error: error.message
             });
         }
     };
     
         //get income
     export async function getallexpense(req,res) {
         const user_id = req.user_id;
     
         if (!Number.isInteger(Number(user_id)) || Number(user_id) <= 0) {
             return res.status(401).json({
                 success: false,
                 message: "User identity missing or invalid; please log in again"
             });
         }
     
         try {
             const rows = await runQuery(
                "SELECT * FROM expenses WHERE user_id = ? ORDER BY expense_date DESC",
                 [user_id]
             );
     
             return res.status(200).json({
                 success: true,
                 expenses: rows
             });
         } catch (error) {
             console.error("Get expense error:", error);
             return res.status(500).json({
                 success: false,
                 message: "Error in fetching expense",
                 error: error.message
             });
         }
     };
     
     export async function updateExpense(req,res) {
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
                 "UPDATE expenses SET amount = ? WHERE user_id = ?",
                 [amount, user_id]
             );
     
             if (result.affectedRows === 0) {
                 return res.status(404).json({
                     success: false,
                     message: "No expense records found for this user"
                 });
             }
     
             return res.status(200).json({
                 success: true,
                 message: "expense updated successfully",
                 affectedRows: result.affectedRows
             });
         } catch (error) {
             console.error("Update expense error:", error);
             return res.status(500).json({
                 success: false,
                 message: "Error updating expense",
                 error: error.message
             });
         }
     };
     
     export async function deleteExpense(req,res) {
         const user_id=req.user_id;
         try{
             
             await runQuery(
             "delete from expenses where user_id=?",
             [user_id]
             );
                     
             res.status(201).json({
             message: "Expenses deleted successfully",
                                 
                                 
             });
                     
             } catch (error) {
               console.error(error);
                     
               res.status(500).json({
               message: "Error deleting expense"
                });
                 }
             };
     


      
            
            
        
    
          
                
                
            
      
            
            
        
