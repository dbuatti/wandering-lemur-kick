export interface ServiceTier {
  id: string;
  name: string;
  subtitle: string;
  rate: number;
  focus: string;
  features: string[];
}

export const tiers: ServiceTier[] = [
  {
    id: "01",
    name: "Maintenance",
    subtitle: "Keep things running.",
    rate: 100,
    focus: "For professionals who want:",
    features: ["Fast troubleshooting", "Device setup", "Basic security checks", "Ongoing support access"],
  },
  {
    id: "02",
    name: "Optimization",
    subtitle: "Save time and reduce frustration.",
    rate: 130,
    focus: "Includes:",
    features: ["Workflow review", "File system organisation", "Cloud consolidation", "Security review", "Basic automation", "Subscription audit"],
  },
  {
    id: "03",
    name: "Recovery & Resilience",
    subtitle: "When things go wrong.",
    rate: 150,
    focus: "Includes:",
    features: ["Data recovery help", "Full system rebuild", "Secure migration", "Emergency response", "Long-term backup planning"],
  },
];

export const faqs = [
  {
    question: "Who do you usually work with?",
    answer:
      "Mostly people and organisations in the performing arts: performers, musical directors, directors, producers, production and touring companies, and arts schools. I also help families and small businesses who want their technology set up properly.",
  },
  {
    question: "Do you provide on-site support in Melbourne?",
    answer:
      "Yes, I provide on-site support across Melbourne, particularly in the inner suburbs and Bayside areas. I also offer secure remote support for other locations.",
  },
  {
    question: "Do you work with Windows or just Apple?",
    answer:
      "While I am an Apple Specialist, I often manage mixed environments. I can help ensure Windows-based tools work correctly within your Apple ecosystem.",
  },
  {
    question: "Something has broken right before a show or deadline. Can you help?",
    answer:
      "Send an enquiry and choose “Something broke and I need help” so I can prioritise it. Urgent recovery work is covered by the Recovery & Resilience tier, which includes emergency response.",
  },
  {
    question: "How do you handle sensitive data and privacy?",
    answer:
      "Privacy is a priority. I use professional encryption, do not store your passwords, and can perform privacy audits to ensure your data is secure.",
  },
  {
    question: "Is there a minimum booking time?",
    answer: "For on-site visits, there is a 1-hour minimum. Remote support can be booked in 30-minute increments.",
  },
];
