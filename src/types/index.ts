export interface Lead {
  id: string;
  client_name: string;
  status: 'Approved' | 'Discard';
  in_radius: boolean;
  tag: string;
  created_at: string;
}

export interface LeadMetrics {
  total: number;
  inRadius: number;
  outOfRadius: number;
}

export interface ClientLeadCount {
  client: string;
  count: number;
}

export interface StatusPercentage {
  client: string;
  approved: number;
  discard: number;
}

export interface TagDistribution {
  tag: string;
  count: number;
  percentage: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}
