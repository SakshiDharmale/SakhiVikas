
const spendingGroups = {
    NECESSITY: [
        "Food",
        "Grocery",
        "Rent",
        "Electricity",
        "Water",
        "Gas",
        "Healthcare",
        "Medicine",
        "Education",
        "Transport",
        "Mobile Recharge"
    ],

    ENTERTAINMENT: [
        "Movies",
        "OTT",
        "Gaming",
        "Outing",
        "Events",
        "Concert",
        "Entertainment"
    ]
};


export function getSpendingGroup(category) {

    if (!category) {
        return "OTHER";
    }

    const normalizedCategory =
        category.trim().toLowerCase();

    for (const [group, categories] of Object.entries(spendingGroups)) {

        const normalizedCategories =
            categories.map(item => item.toLowerCase());

        if (normalizedCategories.includes(normalizedCategory)) {
            return group;
        }
    }

    return "OTHER";
}



