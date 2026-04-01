export interface PatientSearchResult {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
}

export interface SearchData {
  patients: PatientSearchResult[];
  doctors: any[];
  reports: any[];
}
