
export interface SubscriptionStatus {
  active: boolean;
  plan: string;
  expiresAt: string;
}

export interface ApiError {
  error: string;
}
export interface ApiErrorResponse {
  message?: string;
}