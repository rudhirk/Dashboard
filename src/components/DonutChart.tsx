import { StatusDistribution } from '../types';
import { useEffect, useRef, useState } from 'react';
import { Target } from 'lucide-react';

interface DonutChartProps {
  data: StatusDistribution[];
  title: string;
}

const STATUS_COLORS: Record<string, string> = {
  Discard: '#EA4335',
  Approved: '#16a34a',
};

export function DonutChart({ data, title }: DonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) - 10;
    const innerRadius = outerRadius * 0.6;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (item.percentage / 100) * 2 * Math.PI;
      const isHovered = hoveredIndex === index;
      const drawRadius = isHovered ? outerRadius + 5 : outerRadius;

      ctx.beginPath();
      ctx.arc(centerX, centerY, drawRadius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();

      ctx.fillStyle = STATUS_COLORS[item.status] || '#888';
      ctx.fill();
      ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (isHovered) {
        ctx.shadowColor = STATUS_COLORS[item.status];
        ctx.shadowBlur = 20;
      }

      const labelAngle = currentAngle + sliceAngle / 2;
      const labelRadius = (outerRadius + innerRadius) / 2;
      const labelX = centerX + Math.cos(labelAngle) * labelRadius;
      const labelY = centerY + Math.sin(labelAngle) * labelRadius;

      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(item.percentage)}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });
  }, [data, hoveredIndex]);

  return (
    <div className="relative bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-4 sm:p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-200 dark:border-slate-700/50 overflow-hidden group animate-fadeIn">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
            <Target size={18} className="text-white sm:w-5 sm:h-5" />
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-8">
          <div className="p-2 sm:p-4 bg-gray-100 dark:bg-slate-700/20 rounded-xl">
            <canvas
              ref={canvasRef}
              width={240}
              height={240}
              className="w-full h-auto max-w-[240px]"
            />
          </div>
          <div className="space-y-3 sm:space-y-4 flex-1 w-full">
            {data.map((item, index) => (
              <div
                key={item.status}
                className="flex items-center gap-2 sm:gap-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/50 p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-slate-700/30"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="w-4 sm:w-6 h-4 sm:h-6 rounded-full shadow-lg flex-shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[item.status] }}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 dark:text-slate-300 text-xs sm:text-sm font-semibold">{item.status}</p>
                  <p className="text-gray-900 dark:text-white text-base sm:text-xl font-bold">
                    {item.count} <span className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm">({Math.round(item.percentage)}%)</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
