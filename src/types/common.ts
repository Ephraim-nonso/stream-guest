// Common types used across the application

export type ApiResponse<T> = {
  data: T;
  message?: string;
  error?: string;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

