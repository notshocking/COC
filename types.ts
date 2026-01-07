export enum Verdict {
  CHAD = 'CHAD',
  CHUD = 'CHUD',
  UNKNOWN = 'UNKNOWN'
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
  explanation: string[]; // Changed to array for bullet points
  keyFeatures: string[];
  improvements: ProductRecommendation[];
}

export interface AppState {
  status: 'IDLE' | 'ANALYZING' | 'RESULT' | 'ERROR';
  imageSrc: string | null;
  result: AnalysisResult | null;
  error: string | null;
}