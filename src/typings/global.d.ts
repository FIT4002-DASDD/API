import "jest-extended";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeTypeOrNull(type: any): R;
      // toBeWithinRange(a: number, b: number): R;
    }

    interface Expect {
      toBeTypeOrNull(type: any): R;
      // toBeWithinRange(a: number, b: number): R;
    }
  }
}

export interface PaginationMetadata {
  /** current page number */
  page: number;
  /**max item count per page (i.e. offset) */
  per_page: number;
  /** actual item count per page */
  page_count: number;
  /** total item count that fits the search criteria */
  total_count: number;
  links: Links;
}

export interface Links {
  self: string;
  first: string;
  previous: string;
  next: string;
  last: string;
}
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
export {};
