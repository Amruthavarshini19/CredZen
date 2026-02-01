const axios = require("axios");

const HF_API_KEY = process.env.HF_API_KEY;
// Use the router endpoint which replaces api-inference
const MODEL_URL = "https://router.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

async function runLLM(prompt) {
  if (!HF_API_KEY) {
    throw new Error("Missing HF_API_KEY in .env");
  }

  const response = await axios.post(
    MODEL_URL,
    {
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.3,
        return_full_text: false
      },
    },
    {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data[0].generated_text;
}

// Helper: Calculate category stats deterministically
function calculateStats(transactions) {
  const categoryTotals = {};
  let totalSpend = 0;

  transactions.forEach(tx => {
    const amount = parseFloat(tx.amount) || 0;
    // Exclude income/payments if strictly "spending"
    if (amount > 0) {
      const cat = tx.category_label || tx.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
      totalSpend += amount;
    }
  });

  const categories = Object.keys(categoryTotals).map(cat => ({
    category: cat,
    amount: categoryTotals[cat],
    percentage: totalSpend > 0 ? Math.round((categoryTotals[cat] / totalSpend) * 100) : 0
  }));

  // Sort by amount desc
  categories.sort((a, b) => b.amount - a.amount);

  return { categories, totalSpend };
}

async function analyzeTransactions(transactions, availableCards = []) {
  try {
    // 1. Calculate strictly correct numbers in JS
    const { categories, totalSpend } = calculateStats(transactions);
    const topCategories = categories.slice(0, 4);
    const highest = categories[0] || { category: 'None', amount: 0 };
    const lowest = categories[categories.length - 1] || { category: 'None', amount: 0 };

    const cardsContext = availableCards.length > 0
      ? `User's Available Cards: ${JSON.stringify(availableCards.map(c => c.name))}.`
      : "Recommend generic popular credit cards.";

    // 2. Ask LLM for qualitative advice ONLY, passing the calculated stats
    const prompt = `
<|system|>
You are a financial advisor AI.
I will provide the user's spending data.
Your goal is to generate:
1. "spending_insights": simple text comments about their highest and lowest spending.
2. "smart_card_usage_advice": recommend WHICH of the available cards to use for their highest category.
3. "reward_optimization_tips": generic tips to save money.

User's Card Options: ${cardsContext}

Spending Data:
- Top Spending Category: ${highest.category} ($${highest.amount})
- Lowest Spending Category: ${lowest.category} ($${lowest.amount})
- Total Spend: $${totalSpend}

Return a valid JSON object matching this structure EXACTLY:
{
  "spending_insights": ["Insight about highest spend", "Insight about lowest spend"],
  "smart_card_usage_advice": "Advice on which card to use for ${highest.category}",
  "reward_optimization_tips": ["Tip 1", "Tip 2"]
}
Do NOT wrap in markdown. Return raw JSON.
</s>
<|user|>
Generate insights.
</s>
<|assistant|>
`;

    console.log("Sending request to HF LLM (Zephyr)...");
    const resultText = await runLLM(prompt);
    console.log("HF Raw Response:", resultText);

    // Extract JSON
    const firstBrace = resultText.indexOf('{');
    const lastBrace = resultText.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) throw new Error("No JSON found");
    const jsonStr = resultText.substring(firstBrace, lastBrace + 1);
    const llmResult = JSON.parse(jsonStr);

    // 3. Merge JS Stats + LLM Advice
    return {
      top_spending_categories: topCategories, // From JS (Accurate)
      spending_insights: llmResult.spending_insights, // From LLM
      smart_card_usage_advice: llmResult.smart_card_usage_advice, // From LLM
      reward_optimization_tips: llmResult.reward_optimization_tips // From LLM
    };

  } catch (error) {
    console.error("Error calling LLM, using fallback:", error);

    // Fallback using calculated stats if possible
    const { categories } = calculateStats(transactions);
    const highest = categories[0] || { category: 'General', amount: 0 };

    return {
      "top_spending_categories": categories.slice(0, 4),
      "spending_insights": [
        `Highest Spend: ${highest.category} - ₹${highest.amount}`,
        "Consider reviewing your recurring subscriptions."
      ],
      "smart_card_usage_advice": `Use your best rewards card for ${highest.category} purchases.`,
      "reward_optimization_tips": [
        "Pay your full balance to avoid interest.",
        "Check for new card offers."
      ]
    };
  }
}

module.exports = { runLLM, analyzeTransactions };
