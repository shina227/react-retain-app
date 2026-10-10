// Shape of every paginated list response.
export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Shape of every error response body. */
export interface ApiErrorBody {
  error: {
    message: string;
    code: string;
    details?: Record<string, string[]>;
  };
}
