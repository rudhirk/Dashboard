import { useState, useEffect } from 'react';
import { fetchGoogleSheetData, cacheLeads, getCachedLeads } from '../services/googleSheets';
import { Lead, LeadMetrics, ClientLeadCount, StatusPercentage, TagDistribution, StatusDistribution } from '../types';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const cachedData = getCachedLeads();
      if (cachedData) {
        setLeads(cachedData.leads);
      }

      const freshLeads = await fetchGoogleSheetData();
      setLeads(freshLeads);
      cacheLeads(freshLeads);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads from Google Sheets');
      console.error('Error fetching leads:', err);

      const cachedData = getCachedLeads();
      if (cachedData) {
        setLeads(cachedData.leads);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const syncGoogleSheets = async () => {
    await fetchLeads();
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return {
    leads,
    isLoading,
    error,
    refetch: fetchLeads,
    syncGoogleSheets,
  };
}

export function calculateMetrics(leads: Lead[]): LeadMetrics {
  return {
    total: leads.length,
    inRadius: leads.filter(lead => lead.in_radius).length,
    outOfRadius: leads.filter(lead => !lead.in_radius).length,
  };
}

export function getClientLeadCounts(leads: Lead[]): ClientLeadCount[] {
  const counts = leads.reduce((acc, lead) => {
    const tag = lead.tag || 'Uncategorized';
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts)
    .map(([client, count]) => ({ client, count }))
    .sort((a, b) => b.count - a.count);
}

export function getStatusPercentages(leads: Lead[]): StatusPercentage[] {
  const tagData = leads.reduce((acc, lead) => {
    const tag = lead.tag || 'Uncategorized';
    if (!acc[tag]) {
      acc[tag] = { approved: 0, discard: 0 };
    }
    if (lead.status === 'Approved') {
      acc[tag].approved++;
    } else {
      acc[tag].discard++;
    }
    return acc;
  }, {} as Record<string, { approved: number; discard: number }>);

  return Object.entries(tagData)
    .map(([client, data]) => ({
      client,
      approved: data.approved,
      discard: data.discard,
    }))
    .sort((a, b) => (b.approved + b.discard) - (a.approved + a.discard));
}

export function getTagDistribution(leads: Lead[]): TagDistribution[] {
  const total = leads.length;
  const counts = leads.reduce((acc, lead) => {
    const tag = lead.tag || 'Uncategorized';
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts)
    .map(([tag, count]) => ({
      tag,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getStatusDistribution(leads: Lead[]): StatusDistribution[] {
  const total = leads.length;
  const counts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts)
    .map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(leads: Lead[]): string[] {
  const tags = new Set(leads.map(lead => lead.tag || 'Uncategorized'));
  return Array.from(tags).sort();
}

export function filterLeadsByDateRange(leads: Lead[], range: string, customStartDate?: string, customEndDate?: string): Lead[] {
  if (range === 'all') return leads;

  if (range === 'custom' && customStartDate && customEndDate) {
    const start = new Date(customStartDate);
    const end = new Date(customEndDate);
    end.setHours(23, 59, 59, 999);
    return leads.filter(lead => {
      const leadDate = new Date(lead.created_at);
      return leadDate >= start && leadDate <= end;
    });
  }

  const now = new Date();
  const startDate = new Date();

  switch (range) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'last3days':
      startDate.setDate(now.getDate() - 3);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'last7days':
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'mtd':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'last4weeks':
      startDate.setDate(now.getDate() - 28);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
    default:
      return leads;
  }

  return leads.filter(lead => new Date(lead.created_at) >= startDate);
}

export function filterLeadsByTag(leads: Lead[], tag: string): Lead[] {
  if (tag === 'all') return leads;
  return leads.filter(lead => lead.tag === tag);
}
