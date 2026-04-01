export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  score: number;
  metadata: Record<string, any>;
}

export interface SearchResultGroup {
  type: string;
  label: string;
  count: number;
  results: SearchResultItem[];
}

export interface SearchData {
  query: string;
  groups: SearchResultGroup[];
}
