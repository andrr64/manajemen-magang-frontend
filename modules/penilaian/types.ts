export interface AssessmentItem {
  id: string;
  name: string;
  desc: string;
  score: number;
  weight: number;
  feedback: string;
  attachment: string | null;
}

export interface CriteriaItem {
  id: number;
  criteriaName: string;
  weight: number;
  score: number;
  feedback: string;
}

export interface GradeSummary {
  overallScore: number;
  gradeLetter: string;
  status: "Lulus" | "Tidak Lulus" | "Pending";
}

export interface SubmitGradeRequest {
  studentId: string | number;
  periodeMagangId?: string;
  mentorId?: string;
  grades: {
    criteriaId: string | number;
    score: number;
    feedback: string;
  }[];
}
