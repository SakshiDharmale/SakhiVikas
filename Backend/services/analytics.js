import db from '../db.js';
import dayjs from 'dayjs';

import { getDateRange } from '../utilities/DataUtilities.js';
//import expenseController from './ExpenseController.js';
//import incomeController from './Incomecontroller.js';

const runQuery = (sql, values = []) =>
    new Promise((resolve, reject) => {
        db.query(sql, values, (error, rows) => {
            if (error) reject(error);
            else resolve(rows);
        });
    });


//income overview

export async function getIncomeOverview( userId,range) {
    
    const { start, end } = getDateRange(range);

    const incomes = await runQuery(
        `
        SELECT amount, date
        FROM income
        WHERE user_id = ?
          AND date >= ?
          AND date <= ?
        ORDER BY date DESC
        `,
        [userId, start, end]
    );

    return incomes;
}
//expense overview
export async function getExpenseOverview( userId, range) {

    const { start, end } = getDateRange(range);

    const expenses = await runQuery(
        `
        SELECT expenses.amount, expenses.expense_date AS date, categories.name AS category
        FROM expenses
        JOIN categories ON categories.id = expenses.category_id
        WHERE user_id = ?
          AND expense_date >= ?
          AND expense_date <= ?
        ORDER BY expense_date DESC
        `,
        [userId, start, end]
    );

    return expenses;
}

//Financial analytics
export async function getFinancialAnalytics(userId, range) {
    const incomes=await getIncomeOverview(userId, range);
    const expenses=await getExpenseOverview(userId, range);
    const amounts = expenses.map(
        expense => Number(expense.amount)
    );
    const totalExpense = amounts.reduce(
        (sum, amount) => sum + amount,
        0
    );
     const amountI= incomes.map(
        income => Number(income.amount)
    );
    const totalIncome = amountI.reduce(
        (sum, amount) => sum + amount,
        0
    );
    const averageExpense = amounts.length ? (totalExpense / amounts.length).toFixed(2) : 0;

    const highestExpense = amounts.length ? Math.max(...amounts) : 0;

    const lowestExpense = amounts.length ? Math.min(...amounts) : 0;
    const availableBalance=totalIncome-totalExpense;
    const savingsRate = calculateSavingRate(availableBalance, totalIncome);
    return{
      totalIncome,totalExpense,availableBalance,savingsRate,highestExpense,lowestExpense,
      averageExpense
    }

    

}
//saving
export function calculateSavingRate(availableBalance, totalIncome) {
  if (totalIncome <= 0) return 0;
  const savingRate = (availableBalance / totalIncome) * 100;
  return parseFloat(savingRate.toFixed(2));
}


async function getSpending(userId, startDate, endDate){
    const expenses = await runQuery(
        `
        SELECT amount, expense_date AS date
        FROM expenses
        WHERE user_id = ?
          AND expense_date >= ?
          AND expense_date <= ?
        ORDER BY expense_date DESC
        `,
        [userId, startDate, endDate]
    );

    return expenses;

}


// calendar period: offset 0 = current, 1 = previous, ...
export function getPeriodRange(type, offset) {
    const unit = ['daily', 'weekly', 'monthly', 'yearly'].includes(type)
        ? (type === 'daily' ? 'day' : type === 'weekly' ? 'week' : type === 'yearly' ? 'year' : 'month')
        : 'month';
    const base = dayjs().subtract(offset, unit);
    return {
        start: base.startOf(unit).toDate(),
        end: base.endOf(unit).startOf('day').toDate()
    };
}


function calculatePercentageChange(current, previous) {
    if (previous === 0) return current === 0 ? 0 : null;   // null = no baseline
    return Number((((current - previous) / Math.abs(previous)) * 100).toFixed(2));
}


const fmt = (d) => dayjs(d).format('YYYY-MM-DD');


export async function getSpendingPattern(userId, type = "monthly", count = 4) {

    // run all period queries in parallel; order is preserved
    const periods = await Promise.all(
        Array.from({ length: count }, async (_, i) => {
            const { start, end } = getPeriodRange(type, i);

            // pass the object directly (not range={start,end})
            const summary = await getFinancialAnalytics(userId,{start, end});

            return {
                period: i === 0 ? "current" : `${i}_periods_ago`,
                start: fmt(start),
                end: fmt(end),
                income: summary.totalIncome,        // mapped from the real field names
                expense: summary.totalExpense,
                savings: summary.availableBalance,
                savingsRate: summary.savingsRate
            };
        })
    );



    const [current, previous] = periods;

    const compare = (key) => ({
        current: current[key],
        previous: previous[key],
        percentageChange: calculatePercentageChange(current[key], previous[key])
    });

    return {
        periodType: type,
        current: {
            start: current.start,
            end: current.end,
            income: current.income,
            expense: current.expense,
            savings: current.savings
        },
        comparison: {
            expense: compare("expense"),
            income: compare("income"),
            savings: compare("savings")
        },
        history: periods
    };
}



export async function getSpendingSummary(req,res){
     try{
      const user_id=req.user_id;
      const range = String(req.body.range ?? "monthly").trim().toLowerCase();
      const allowedRanges=["daily","weekly","monthly","yearly"];
      if(!allowedRanges.includes(range)){
        return res.status(400).json({
          message:"Invalid range. Allowed values are daily, weekly, monthly, yearly",
          receivedRange: req.query.range ?? null
        });
      }

    const result=await getSpendingPattern(user_id, range);
    return res.status(200).json({
      success:true,
      data:result}
    );
  }
  catch(error){
    console.error("spending summary error:",error);
    return res.status(500).json({
      success:false,
      message:"unable to calculate"
    });
  }}

// Financial health score based on savings, expense ratio, and expense stability.
async function getMonthlyExpenses(userId, monthCount = 12) {
    const end = dayjs().endOf('day');
    const start = end.subtract(monthCount - 1, 'month').startOf('month');
    const expenses = await runQuery(
        `SELECT amount, expense_date AS date
         FROM expenses
         WHERE user_id = ? AND expense_date >= ? AND expense_date <= ?`,
        [userId, start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')]
    );

    return Array.from({ length: monthCount }, (_, index) => {
        const monthStart = start.add(index, 'month');
        const monthEnd = monthStart.endOf('month');
        return expenses
            .filter(({ date }) => {
                const expenseDate = dayjs(date);
                return !expenseDate.isBefore(monthStart, 'day') && !expenseDate.isAfter(monthEnd, 'day');
            })
            .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    });
}

export async function financialhealthScore(userId, range = 'monthly') {
    const { totalIncome, totalExpense, availableBalance } =
        await getFinancialAnalytics(userId, range);
    const saving = calculateSavingRate(availableBalance, totalIncome);

    const savingScore = saving >= 30 ? 40 : saving >= 20 ? 32 : saving >= 10 ? 24 : saving >= 5 ? 15 : saving >= 0 ? 7 : 0;
    const expenseRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
    const expenseScore = totalIncome <= 0 ? 0 : expenseRatio <= 50 ? 30 : expenseRatio <= 60 ? 25 : expenseRatio <= 70 ? 20 : expenseRatio <= 80 ? 14 : expenseRatio <= 100 ? 7 : 0;

    const monthlyExpenses = await getMonthlyExpenses(userId);
    let stabilityScore = 0;
    const mean = monthlyExpenses.reduce((sum, value) => sum + value, 0) / monthlyExpenses.length;
    if (mean > 0) {
        const variance = monthlyExpenses.reduce((sum, value) => sum + (value - mean) ** 2, 0) / monthlyExpenses.length;
        const coefficientOfVariation = Math.sqrt(variance) / mean;
        stabilityScore = coefficientOfVariation <= 0.1 ? 30 : coefficientOfVariation <= 0.2 ? 25 : coefficientOfVariation <= 0.3 ? 20 : coefficientOfVariation <= 0.4 ? 14 : 7;
    }

    return {
        score: savingScore + expenseScore + stabilityScore,
        saving,
        savingScore,
        expenseRatio: Number(expenseRatio.toFixed(2)),
        expenseScore,
        stabilityScore,
        monthlyExpenses
    };
}
