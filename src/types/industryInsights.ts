// types/industryInsights.ts

export type SalaryRange = {
  role: string;
  min: number;
  max: number;
  median: number;
  location: string;
};

export type DemandLevel = "high" | "medium" | "low";
export type MarketOutlook = "positive" | "neutral" | "negative";

export type IndustryInsights = {
  salaryRanges: SalaryRange[];
  growthRate: number;
  demandLevel: DemandLevel;
  topSkills: string[];
  marketOutlook: MarketOutlook;
  keyTrends: string[];
  recommendedSkills: string[];
  lastUpdated: Date;
  nextUpdate: Date;
};
