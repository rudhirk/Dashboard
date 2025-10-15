import { ClientLeadCount } from '../types';
import { BarChart3 } from 'lucide-react';

interface BarChartProps {
  data: ClientLeadCount[];
  title: string;
}

const COLORS = ['#4285F4', '#34A853', '#FBBC04', '#EA4335'];
const GRADIENTS = [
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-yellow-500 to-yellow-600',
  'from-red-500 to-red-600',
];

export function BarChart({ data, title }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="relative bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-4 sm:p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-200 dark:border-slate-700/50 overflow-hidden group animate-slideInLeft">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
            <BarChart3 size={18} className="text-white sm:w-5 sm:h-5" />
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="space-y-3 sm:space-y-5">
          {data.map((item, index) => {
            const percentage = (item.count / maxValue) * 100;
            return (
              <div key={item.client} className="group/item">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                  <span className="text-gray-700 dark:text-slate-300 text-xs sm:text-sm font-semibold group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors break-words overflow-wrap-anywhere flex-1 min-w-0">{item.client}</span>
                  <span className="text-gray-900 dark:text-white font-bold text-sm sm:text-base md:text-lg bg-gray-200 dark:bg-slate-700/50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg group-hover/item:bg-gray-300 dark:group-hover/item:bg-slate-600/50 transition-colors flex-shrink-0">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700/30 rounded-full h-8 sm:h-10 relative overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2 sm:pr-4 bg-gradient-to-r ${GRADIENTS[index % GRADIENTS.length]} shadow-lg group-hover/item:shadow-xl`}
                    style={{
                      width: `${percentage}%`,
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    <span className="text-white text-xs sm:text-sm font-bold drop-shadow-lg whitespace-nowrap">
                      {item.count} {item.count === 1 ? 'lead' : 'leads'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
