import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  borderColor: string;
  gradient: string;
  icon?: React.ReactNode;
  delay?: number;
}

export function MetricCard({ title, value, borderColor, gradient, icon, delay = 0 }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const duration = 1000;
      const increment = value / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <div
      className={`relative bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-4 sm:p-6 rounded-2xl shadow-2xl border-l-4 ${borderColor} hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 group overflow-hidden animate-scaleIn`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">{title}</h3>
          <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity`}>
            {icon || <TrendingUp size={14} className="text-white sm:w-4 sm:h-4" />}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-1 tabular-nums">
            {displayValue}
          </p>
          <ArrowUpRight className="text-green-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
        </div>

        <div className="mt-3 h-1 bg-gray-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: displayValue > 0 ? '100%' : '0%', transitionDelay: `${delay}ms` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
