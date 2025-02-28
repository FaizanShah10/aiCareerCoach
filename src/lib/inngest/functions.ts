import { generateAiIndustryInsights } from "../../../actions/industryInsights";
import { db } from "../prisma";
import { inngest } from "./client";

export const generateIndusryInsights = inngest.createFunction(
  { id: "generate-industry-insights" },
  {
    cron: "0 0 * * 0"
  },
  async ({ step }) => {

    const industries = await step.run("Fetch Industry", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true }
      });
    });

    // Generate insights for each industry and update DB
    for (const { industry } of industries) {
      await step.run(`Generate Insights for ${industry}`, async () => {
        const insights = await generateAiIndustryInsights(industry);

        // Update industry insights in the database
        await db.industryInsight.updateMany({
          where: { industry },
          data: {
            salaryRanges: insights.salaryRanges,
            growthRate: insights.growthRate,
            demandLevel: insights.demandLevel,
            topSkills: insights.topSkills,
            marketOutlook: insights.marketOutlook,
            keyTrends: insights.keyTrends,
            recommendedSkills: insights.recommendedSkills,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        });

        return insights;
      });
    }

    return { status: "Industry Insights Updated Successfully" };
  }
);
