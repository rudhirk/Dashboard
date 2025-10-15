import { StatusPercentage } from '../types';
import { PieChart } from 'lucide-react';

interface StackedBarChartProps {
  data: StatusPercentage[];
  title: string;
}

export function StackedBarChart({ data, title }: StackedBarChartProps) {
  return (
    <div className="relative bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-4 sm:p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-200 dark:border-slate-700/50 overflow-hidden group animate-slideInRight">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
            <PieChart size={18} className="text-white sm:w-5 sm:h-5" />
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-200 dark:bg-slate-700/30 rounded-lg">
            <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg"></div>
            <span className="text-gray-700 dark:text-slate-300 text-xs sm:text-sm font-medium">Discard</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-200 dark:bg-slate-700/30 rounded-lg">
            <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg"></div>
            <span className="text-gray-700 dark:text-slate-300 text-xs sm:text-sm font-medium">Approved</span>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-5">
          {data.map((item, index) => {
            const total = item.approved + item.discard;
            const approvedPercent = total > 0 ? (item.approved / total) * 100 : 0;
            const discardPercent = total > 0 ? (item.discard / total) * 100 : 0;

            return (
              <div key={item.client} className="group/item">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                  <span className="text-gray-700 dark:text-slate-300 text-xs sm:text-sm font-semibold group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors break-words overflow-wrap-anywhere flex-1 min-w-0">{item.client}</span>
                  <span className="text-gray-900 dark:text-white font-bold text-xs sm:text-sm bg-gray-200 dark:bg-slate-700/50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg group-hover/item:bg-gray-300 dark:group-hover/item:bg-slate-600/50 transition-colors flex-shrink-0">
                    Total: {total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700/30 rounded-full h-8 sm:h-10 flex overflow-hidden shadow-inner">
                  {discardPercent > 0 && (
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${discardPercent}%`, transitionDelay: `${index * 100}ms` }}
                    >
                      {discardPercent >= 15 && (
                        <span className="text-white text-xs sm:text-sm font-bold px-1 sm:px-2 drop-shadow-lg">
                          {Math.round(discardPercent)}%
                        </span>
                      )}
                    </div>
                  )}
                  {approvedPercent > 0 && (
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${approvedPercent}%`, transitionDelay: `${index * 100 + 50}ms` }}
                    >
                      {approvedPercent >= 15 && (
                        <span className="text-white text-xs sm:text-sm font-bold px-1 sm:px-2 drop-shadow-lg">
                          {Math.round(approvedPercent)}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}