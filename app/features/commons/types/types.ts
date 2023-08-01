export type EditorValues = {
  js: string;
  css: string;
  html: string;
};
export type PaginatedResults<T> = {
  total: number;
  skip: number;
  limit: number;
  results: T[];
};
