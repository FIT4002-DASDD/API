export interface PaginationParams {
  offset?: number;
  limit?: number;
}

export interface GoogleAdFilterParams {
  political?: string[];
  gender?: string[];
  tag?: string[];
  bots?: string[];
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface TwitterAdFilterParams {
  tag?: string[];
  bots?: string[];
  startDate?: Date | null;
  endDate?: Date | null;
  political?: string[];
  adType?: string[];
  botType?: string[];
}
