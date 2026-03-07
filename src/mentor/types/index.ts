/* ============================================================
   SIGNSIGHT — Mentor Dashboard Type Definitions
   Mirrors every MongoDB document shape from dbConfig.py exactly.
   ============================================================ */

export type Level = "basic" | "intermediate" | "advanced";
export type Area =
  | "family"
  | "alphabet"
  | "numbers"
  | "objects"
  | "actions"
  | "emotions";
export type Assessment =
  | "Excellent"
  | "Good"
  | "Needs Improvement"
  | "Critical";

// --------------------------------------------------------
// users  collection
// --------------------------------------------------------
export interface UserStats {
  totalAttempts: number;
  levels: Partial<Record<Level, number>>;
  lastAttemptAt?: string;
}

export interface UserDocument {
  userId: string;
  createdAt: string;
  lastSeenAt: string;
  profile: Record<string, unknown>;
  stats: UserStats;
}

// --------------------------------------------------------
// attempts  collection
// --------------------------------------------------------
export interface QuizSummary {
  totalQuestions: number;
  correctAnswers: number;
  overallScore: number;
  assessment: Assessment | null;
}

export interface AreaData {
  correct: number;
  total: number;
  percentage: number;
  score_display: string;
}

export interface AttemptInsights {
  weakAreas: Area[];
  strongAreas: Area[];
  recommendations: string[];
}

export interface EyeContactResult {
  video_duration: number;
  eye_contact: { duration: number; percentage: string };
  look_away: { duration: number; percentage: string };
  face_not_detected: { duration: number; percentage: string };
  error?: string;
}

export interface VideoAnalysis {
  eye_contact?: EyeContactResult | { error: string };
  sign_recognition?: Record<string, unknown> | { error: string };
}

export interface MLResult {
  predicted_score: number;
  base_value: number;
  shap_values: number[];
}

export interface MongoDate {
  $date: string;
}

export interface AttemptDocument {
  userId: string;
  level: Level;
  attemptNumber: number;
  submittedAt: string | MongoDate;
  quiz: QuizSummary;
  areas: Partial<Record<Area, AreaData>>;
  insights: AttemptInsights;
  videoAnalysis: VideoAnalysis | null;
  ml: MLResult | null;
  createdAt: string | MongoDate;
}

// --------------------------------------------------------
// API response shapes
// --------------------------------------------------------
export interface ProgressPoint {
  attempt: number;
  score: number;
  date: string;
}

export interface LevelStats {
  attemptCount: number;
  avgScore: number;
  bestScore: number;
  worstScore: number;
  areaAverages: Partial<Record<Area, number>>;
  assessments: Partial<Record<Assessment, number>>;
  videoAttempts: number;
}

export interface WeakStrongArea {
  area: Area;
  avg: number;
}

export interface LatestAttempt {
  level: Level;
  score: number;
  assessment: Assessment | null;
  areas: Partial<Record<Area, AreaData>>;
  insights: AttemptInsights;
  submittedAt: string;
  videoAnalysis: VideoAnalysis | null;
}

export interface UserSummary {
  user: UserDocument;
  levelStats: Record<Level, LevelStats>;
  progress: Record<Level, ProgressPoint[]>;
  latest: LatestAttempt | null;
  globalAreaAverages: Partial<Record<Area, number>>;
  weakAreas: WeakStrongArea[];
  strongAreas: WeakStrongArea[];
  totalAttempts: number;
}

export interface AttemptsPage {
  attempts: AttemptDocument[];
  total: number;
  page: number;
  limit: number;
}
