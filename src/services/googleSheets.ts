import { Lead } from '../types';

interface GoogleSheetsResponse {
  values?: string[][];
}

const GOOGLE_SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;
const SHEET_NAME = import.meta.env.VITE_GOOGLE_SHEET_NAME || 'Sheet1';

export async function fetchGoogleSheetData(): Promise<Lead[]> {
  if (!GOOGLE_SHEETS_API_KEY) {
    throw new Error('Google Sheets API key is not configured. Please set VITE_GOOGLE_SHEETS_API_KEY in your .env file');
  }

  if (!SPREADSHEET_ID) {
    throw new Error('Spreadsheet ID is not configured. Please set VITE_GOOGLE_SPREADSHEET_ID in your .env file');
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${GOOGLE_SHEETS_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Google Sheets data: ${response.status} ${response.statusText}. ${errorText}`);
  }

  const data: GoogleSheetsResponse = await response.json();
  const rows = data.values || [];

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map(h => h.toLowerCase().trim());
  const dataRows = rows.slice(1);

  const leads: Lead[] = dataRows.map((row, index) => {
    const lead: Partial<Lead> = {
      id: `lead-${index + 1}`,
      created_at: new Date().toISOString(),
    };

    let hasRadiusColumn = false;

    headers.forEach((header, colIndex) => {
      const value = row[colIndex] || '';

      if (header.includes('client') || header.includes('name')) {
        lead.client_name = value || 'Unknown';
      } else if (header.includes('status')) {
        lead.status = (value === 'Approved' ? 'Approved' : 'Discard') as 'Approved' | 'Discard';
      } else if (header.includes('radius')) {
        hasRadiusColumn = true;
        lead.in_radius = value.toLowerCase() === 'yes' ||
                         value.toLowerCase() === 'true' ||
                         value === '1' ||
                         value.toLowerCase() === 'approved';
      } else if (header.includes('tag') || header.includes('category')) {
        lead.tag = value || 'Uncategorized';
      } else if (header.includes('date') || header.includes('created')) {
        if (value) {
          lead.created_at = new Date(value).toISOString();
        }
      }
    });

    if (!lead.client_name) lead.client_name = 'Unknown';
    if (!lead.status) lead.status = 'Discard';

    if (lead.in_radius === undefined) {
      if (!hasRadiusColumn) {
        lead.in_radius = lead.status === 'Approved';
      } else {
        lead.in_radius = false;
      }
    }

    if (!lead.tag) lead.tag = 'Uncategorized';

    return lead as Lead;
  });

  return leads;
}

export function cacheLeads(leads: Lead[]): void {
  try {
    const cacheData = {
      leads,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('leads_cache', JSON.stringify(cacheData));
  } catch (error) {
    console.error('Failed to cache leads:', error);
  }
}

export function getCachedLeads(): { leads: Lead[]; timestamp: string } | null {
  try {
    const cached = localStorage.getItem('leads_cache');
    if (!cached) return null;
    return JSON.parse(cached);
  } catch (error) {
    console.error('Failed to retrieve cached leads:', error);
    return null;
  }
}

export function clearLeadsCache(): void {
  try {
    localStorage.removeItem('leads_cache');
  } catch (error) {
    console.error('Failed to clear leads cache:', error);
  }
}
