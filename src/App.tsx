import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MetricCard } from './components/MetricCard';
import { BarChart } from './components/BarChart';
import { StackedBarChart } from './components/StackedBarChart';
import { PieChart } from './components/PieChart';
import { DonutChart } from './components/DonutChart';
import {
  useLeads,
  calculateMetrics,
  getClientLeadCounts,
  getStatusPercentages,
  getTagDistribution,
  getStatusDistribution,
  getAllTags,
  filterLeadsByDateRange,
  filterLeadsByTag,
} from './hooks/useLeads';
import { exportDashboardAsPDF, exportDashboardAsImage } from './utils/exportDashboard';

function App() {
  const { leads, isLoading, error, syncGoogleSheets } = useLeads();
  const [dateRange, setDateRange] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredLeads = useMemo(() => {
    let filtered = filterLeadsByDateRange(leads, dateRange, startDate, endDate);
    filtered = filterLeadsByTag(filtered, selectedTag);
    return filtered;
  }, [leads, dateRange, selectedTag, startDate, endDate]);

  const metrics = useMemo(() => calculateMetrics(filteredLeads), [filteredLeads]);
  const clientLeadCounts = useMemo(() => getClientLeadCounts(filteredLeads), [filteredLeads]);
  const statusPercentages = useMemo(() => getStatusPercentages(filteredLeads), [filteredLeads]);
  const tagDistribution = useMemo(() => getTagDistribution(filteredLeads), [filteredLeads]);
  const statusDistribution = useMemo(() => getStatusDistribution(filteredLeads), [filteredLeads]);
  const allTags = useMemo(() => getAllTags(leads), [leads]);

  const handleDownloadDashboard = async (format: 'pdf' | 'image') => {
    try {
      if (format === 'pdf') {
        await exportDashboardAsPDF();
      } else {
        await exportDashboardAsImage();
      }
    } catch (error) {
      console.error('Error exporting dashboard:', error);
      alert('Failed to export dashboard. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-red-500/30 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 dark:text-red-400">Error</h2>
          </div>
          <p className="text-gray-700 dark:text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all w-full shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-3 sm:p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <Header
          onRefresh={syncGoogleSheets}
          onDownloadDashboard={handleDownloadDashboard}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          tags={allTags}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <MetricCard
            title="Total Leads"
            value={metrics.total}
            borderColor="border-blue-500"
            gradient="from-blue-500 to-blue-600"
            delay={0}
          />
          <MetricCard
            title="In Radius Leads"
            value={metrics.inRadius}
            borderColor="border-green-500"
            gradient="from-green-500 to-green-600"
            delay={100}
          />
          <MetricCard
            title="Out of Radius Leads"
            value={metrics.outOfRadius}
            borderColor="border-red-500"
            gradient="from-red-500 to-red-600"
            delay={200}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <BarChart data={clientLeadCounts} title="Lead Per Client" />
          <StackedBarChart data={statusPercentages} title="Percentage" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <PieChart data={tagDistribution} title="Leads by Record Count" />
          <DonutChart data={statusDistribution} title="Approved vs Discarded Leads" />
        </div>

        {filteredLeads.length === 0 && !isLoading && (
          <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-6 sm:p-8 md:p-12 rounded-2xl shadow-2xl text-center mt-6 sm:mt-8 border border-gray-200 dark:border-slate-700/50 animate-fadeIn">
            <div className="max-w-md mx-auto">
              <p className="text-gray-900 dark:text-slate-300 text-lg sm:text-xl font-semibold mb-3 sm:mb-4">No leads found</p>
              <p className="text-gray-600 dark:text-slate-500 text-xs sm:text-sm mb-6 sm:mb-8">
                Click the Sync button to fetch leads from Google Sheets
              </p>
              <button
                onClick={syncGoogleSheets}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
              >
                Sync Google Sheets
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
