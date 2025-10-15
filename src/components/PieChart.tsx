import { TagDistribution } from '../types';
import { useEffect, useRef, useState } from 'react';
import { Tag } from 'lucide-react';

interface PieChartProps {
  data: TagDistribution[];
  title: string;
}

const COLORS = ['#4285F4', '#FBBC04', '#34A853', '#EA4335'];

// Function to get color based on tag name
const getColorForTag = (tag: string, index: number): string => {
  const lowerTag = tag.toLowerCase();
  if (lowerTag === 'discard') return '#EF4444'; // Red
  if (lowerTag === 'approved') return '#22C55E'; // Green
  return COLORS[index % COLORS.length];
};

export function PieChart({ data, title }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (item.percentage / 100) * 2 * Math.PI;
      const isHovered = hoveredIndex === index;
      const color = getColorForTag(item.tag, index);

      ctx.beginPath();
      ctx.arc(centerX, centerY, isHovered ? radius + 5 : radius, currentAngle, currentAngle + sliceAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (isHovered) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
      }

      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(item.percentage)}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });
  }, [data, hoveredIndex]);

  return (
    <div className="relative bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-4 sm:p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-200 dark:border-slate-700/50 overflow-hidden group animate-fadeIn">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg">
            <Tag size={18} className="text-white sm:w-5 sm:h-5" />
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-4 sm:mb-6 p-2 sm:p-4 bg-gray-100 dark:bg-slate-700/20 rounded-xl">
            <canvas
              ref={canvasRef}
              width={240}
              height={240}
              className="w-full h-auto max-w-[240px]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full">
            {data.map((item, index) => (
              <div
                key={item.tag}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/50 p-2 sm:p-3 rounded-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-slate-700/30"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="w-3 sm:w-4 h-3 sm:h-4 rounded-full shadow-lg flex-shrink-0"
                  style={{ backgroundColor: getColorForTag(item.tag, index) }}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 dark:text-slate-300 text-xs sm:text-sm truncate font-medium">{item.tag}</p>
                  <p className="text-gray-900 dark:text-white text-xs font-bold">{item.count} leads</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}