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
  page: number;
  per_page: number;
  page_count: number;
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
export {};
