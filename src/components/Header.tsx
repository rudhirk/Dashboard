
import { Download, RefreshCw, TrendingUp, FileImage, FileText, Sun, Moon, Calendar, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onRefresh: () => void;
  onDownloadDashboard: (format: 'pdf' | 'image') => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  tags: string[];
  selectedTag: string;
  onTagChange: (tag: string) => void;
  isLoading: boolean;
}

export function Header({
  onRefresh,
  onDownloadDashboard,
  dateRange,
  onDateRangeChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  tags,
  selectedTag,
  onTagChange,
  isLoading,
}: HeaderProps) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = () => {
    console.log('Theme toggle button clicked. Current theme:', theme);
    toggleTheme();
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 dark:from-[#1e293b] dark:via-[#334155] dark:to-[#1e293b] p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl mb-6 sm:mb-8 overflow-hidden border border-gray-200 dark:border-slate-700/50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-green-500/5 to-orange-500/5"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg flex-shrink-0">
            <TrendingUp size={24} className="text-white sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 bg-clip-text text-transparent leading-tight">
              Markivate Client Area Tracking
            </h1>
            <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm mt-1">Real-time analytics and insights</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative z-40">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDatePicker(!showDatePicker);
              }}
              className="bg-white dark:bg-slate-800/80 backdrop-blur-sm text-gray-900 dark:text-white text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-300 dark:border-slate-600/50 hover:bg-gray-50 dark:hover:bg-slate-700/80 transition-all flex items-center gap-2 hover:shadow-lg hover:scale-105 active:scale-95 min-w-[140px] relative z-50"
            >
              <Calendar size={16} />
              <span>{dateRange === 'custom' && startDate ? `${startDate} to ${endDate}` : dateRange === 'all' ? 'All Time' : dateRange === 'today' ? 'Today' : dateRange === 'last3days' ? 'Last 3 Days' : dateRange === 'last7days' ? 'Last 7 Days' : dateRange === 'mtd' ? 'Month to Date' : dateRange === 'last4weeks' ? 'Last 4 Weeks' : 'Select Date'}</span>
            </button>

            {showDatePicker && (
              <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4 bg-black/30" onClick={() => setShowDatePicker(false)}>
                <div
                  className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl shadow-2xl p-4 w-full max-w-[400px] relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Select Date Range</h3>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          onDateRangeChange('today');
                          setShowDatePicker(false);
                        }}
                        className="px-3 py-2 text-xs bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        Today
                      </button>
                      <button
                        onClick={() => {
                          onDateRangeChange('last3days');
                          setShowDatePicker(false);
                        }}
                        className="px-3 py-2 text-xs bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        Last 3 Days
                      </button>
                      <button
                        onClick={() => {
                          onDateRangeChange('last7days');
                          setShowDatePicker(false);
                        }}
                        className="px-3 py-2 text-xs bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        Last 7 Days
                      </button>
                      <button
                        onClick={() => {
                          onDateRangeChange('mtd');
                          setShowDatePicker(false);
                        }}
                        className="px-3 py-2 text-xs bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        Month to Date
                      </button>
                      <button
                        onClick={() => {
                          onDateRangeChange('last4weeks');
                          setShowDatePicker(false);
                        }}
                        className="px-3 py-2 text-xs bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        Last 4 Weeks
                      </button>
                      <button
                        onClick={() => {
                          onDateRangeChange('all');
                          setShowDatePicker(false);
                        }}
                        className="px-3 py-2 text-xs bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        All Time
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                    <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-3">Custom Range</p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-slate-400 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            onStartDateChange(e.target.value);
                            onDateRangeChange('custom');
                          }}
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-slate-400 mb-1">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            onEndDateChange(e.target.value);
                            onDateRangeChange('custom');
                          }}
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        />
                      </div>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="w-full px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        Apply Custom Range
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <select
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="bg-white dark:bg-slate-800/80 backdrop-blur-sm text-gray-900 dark:text-white text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-300 dark:border-slate-600/50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all hover:bg-gray-50 dark:hover:bg-slate-700/80 cursor-pointer flex-1 sm:flex-none min-w-[120px]"
          >
            <option value="all">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <button
            onClick={handleThemeToggle}
            className="bg-white dark:bg-slate-800/80 backdrop-blur-sm text-gray-900 dark:text-white text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-300 dark:border-slate-600/50 hover:bg-gray-50 dark:hover:bg-slate-700/80 hover:border-gray-400 dark:hover:border-slate-500 transition-all flex items-center gap-2 hover:shadow-lg hover:scale-105 active:scale-95"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="bg-white dark:bg-slate-800/80 backdrop-blur-sm text-gray-900 dark:text-white text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-gray-300 dark:border-slate-600/50 hover:bg-gray-50 dark:hover:bg-slate-700/80 hover:border-gray-400 dark:hover:border-slate-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <div>
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-500/50 active:opacity-80 touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>

          {showDownloadMenu && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
              onClick={() => setShowDownloadMenu(false)}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div
                className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden w-full max-w-xs animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Download Dashboard</h3>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      onDownloadDashboard('pdf');
                      setShowDownloadMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 text-gray-900 dark:text-white text-base hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors active:bg-gray-200 dark:active:bg-slate-600 rounded-xl touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <FileText size={20} className="text-green-400" />
                    <span>Dashboard PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      onDownloadDashboard('image');
                      setShowDownloadMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 text-gray-900 dark:text-white text-base hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors active:bg-gray-200 dark:active:bg-slate-600 rounded-xl touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <FileImage size={20} className="text-orange-400" />
                    <span>Dashboard Image</span>
                  </button>
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-slate-700">
                  <button
                    onClick={() => setShowDownloadMenu(false)}
                    className="w-full px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}