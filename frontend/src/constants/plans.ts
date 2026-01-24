

export const PLANS = [
  {
    id: "free",
    name: "Starter",
    price: { monthly: "$0", yearly: "$0" },
    description: "Perfect for testing the waters.",
    popular: false,

    limits: {
      minutes: 15,
      aiActions: 3,
      storage: "250 MB",
      semanticSearch: false,
    },
    features: [
      "15 Minutes / month",
      "250 MB Storage",
      "Standard Transcription",
      "3 AI Actions (Trial)",
    ],
    missing: ["Semantic Search", "Llama 3 Insights", "No Watermark"],
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: "$19", yearly: "$290" },
    description: "For creators who need power & speed.",
    popular: true,
    limits: {
      minutes: 600, // 10 Hours
      aiActions: 500,
      storage: "50 GB",
      semanticSearch: true,
    },
    features: [
      "10 Hours / month",
      "50 GB Storage",
      "Semantic Search ⚡",
      "Llama 3 Insights",
      "500 AI Actions",
    ],
  },
  {
    id: "enterprise",
    name: "Business",
    price: { monthly: "$99", yearly: "$990" },
    description: "Dedicated scale for teams.",
    popular: false,
    limits: {
      minutes: 6000, // 100 Hours
      aiActions: "Unlimited", // Handled logically as 999999
      storage: "1 TB",
      semanticSearch: true,
    },
    features: [
      "100 Hours / month",
      "1 TB Storage",
      "Semantic Search ⚡",
      "Llama 3 Insights",
      "Unlimited AI Actions",
      "Custom AI Prompts",
      "API Access",
    ],
    missing: [],
  },
];
