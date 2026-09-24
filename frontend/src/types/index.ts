export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface FinancialProfile {
  id?: number;
  user_id?: number;
  credit_score: number;
  monthly_income: number;
  monthly_expenses: number;
  monthly_debt: number;
  credit_limit: number;
  outstanding_credit: number;
  missed_payments: number;
  financial_goal: string;
  dti?: number;
  utilization?: number;
  available_credit?: number;
  updated_at?: string;
}

export interface InsightItem {
  id: string;
  title: string;
  why_it_matters: string;
  simple_explanation: string;
  suggested_action: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ScoreHistoryItem {
  id: number;
  date: string;
  score: number;
  dti: number;
  utilization: number;
  debt: number;
}

export interface UtilizationBreakdown {
  credit_limit: number;
  used_credit: number;
  available_credit: number;
  utilization_percentage: number;
}

export interface SnapshotDelta {
  score_change: number;
  score_change_text: string;
  utilization_change: number;
  dti_change: number;
  debt_change: number;
}

export interface DashboardData {
  user_name: string;
  has_profile: boolean;
  credit_score?: number;
  utilization?: number;
  dti?: number;
  monthly_debt?: number;
  available_credit?: number;
  financial_goal?: string;
  score_history: ScoreHistoryItem[];
  utilization_breakdown?: UtilizationBreakdown;
  insights: InsightItem[];
  delta?: SnapshotDelta;
}

export interface AIAnalysis {
  id?: number;
  summary: string;
  key_factors: string[];
  action_plan: string[];
  explanation: string;
  created_at?: string;
}

export interface ProgressData {
  snapshots_count: number;
  history: ScoreHistoryItem[];
  delta?: SnapshotDelta;
  current_score?: number;
  current_utilization?: number;
  current_dti?: number;
  current_debt?: number;
}
