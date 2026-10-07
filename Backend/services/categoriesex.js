import { getSpendingGroup } from "../utilities/spendingGroup.js";
import { getExpenseOverview } from "./analytics.js";

export async function categorywiseAnalysis(userid, range = "monthly") {
    const expenses = await getExpenseOverview(userid, range);
    const categoryWise = {};
    const groups = {
        NECESSITY: 0,
        ENTERTAINMENT: 0,
        OTHER: 0
    };
    let totalExpense = 0;

    for (const expense of expenses) {
        const category = expense.category || "Unknown";
        const amount = Number(expense.amount);
        const group = getSpendingGroup(category);

        categoryWise[category] = (categoryWise[category] || 0) + amount;
        groups[group] += amount;
        totalExpense += amount;
    }

    const categoryPercentages = {};
    for (const [category, amount] of Object.entries(categoryWise)) {
        categoryWise[category] = Number(amount.toFixed(2));
        categoryPercentages[category] = totalExpense === 0
            ? 0
            : Number(((amount / totalExpense) * 100).toFixed(2));
    }

    const topCategory = Object.keys(categoryWise).reduce(
        (highest, category) => highest === null || categoryWise[category] > categoryWise[highest] ? category : highest,
        null
    );

    const groupAnalysis = {};
    for (const [group, amount] of Object.entries(groups)) {
        groupAnalysis[group] = {
            amount: Number(amount.toFixed(2)),
            percentage: totalExpense === 0
                ? 0
                : Number(((amount / totalExpense) * 100).toFixed(2))
        };
    }

    return {
        CategoryWise: categoryWise,
        CategoryPercentages: categoryPercentages,
        MaxCategory: topCategory,
        MaxPercentage: topCategory === null ? 0 : categoryPercentages[topCategory],
        TotalExpense: Number(totalExpense.toFixed(2)),
        Groups: groupAnalysis
    };
}

// Keep the existing service export compatible while sharing the combined calculation.
export async function getCategoryGroupAnalysis(userid, range = "monthly") {
    const analysis = await categorywiseAnalysis(userid, range);
    return {
        totalExpense: analysis.TotalExpense,
        groups: analysis.Groups
    };
}
