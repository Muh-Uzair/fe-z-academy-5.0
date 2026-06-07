export interface Enrollment {
  _id: string;
  student: string;
  course: string;
  instructor: string;
  transaction: string;
  enrolledAt: string;
  totalDurationWatchedInMinutes: number;
  watchPercentage: number;
  watchedCompletely: boolean;
  watchedCompletelyAt: string | null;
  mostRecentlySeen: boolean;
  certificateIssued: boolean;
  certificateIssuedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
