export enum Verdict {
  CHAD = 'CHAD',
  CHUD = 'CHUD',
  UNKNOWN = 'UNKNOWN',
}

export interface ProductRecommendation {
  category: string;
  suggestion: string;
  productSearchTerm: string;
}

export interface AnalysisResult {
  verdict: Verdict;
  score: number; // 0-100
  title: string;
  explanation: string[]; // Array for bullet points
  keyFeatures: string[];
  improvements: ProductRecommendation[];
}

// Discriminated union for type-safe state management
export type AppState =
  | { status: 'IDLE' }
  | { status: 'ANALYZING'; imageSrc: string }
  | { status: 'RESULT'; imageSrc: string; result: AnalysisResult }
  | { status: 'ERROR'; imageSrc: string | null; error: string };

// Action types for reducer
export type AppAction =
  | { type: 'START_ANALYSIS'; imageSrc: string }
  | { type: 'ANALYSIS_SUCCESS'; result: AnalysisResult }
  | { type: 'ANALYSIS_ERROR'; error: string }
  | { type: 'RESET' };
