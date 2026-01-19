"use server";

import { getAssessment } from "../../../../../actions/interview";

export async function getAssessmentsAction() {
  return getAssessment();
}
