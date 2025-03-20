'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type WeightLog = {
  id: string;
  user_id: string;
  status: number;
  created_at: string;
};

type Profile = {
  id: string;
  full_name: string;
};

type WeightGraphProps = {
  weightLogs: WeightLog[];
  profiles: Profile[];
};

export default function WeightGraph({ weightLogs, profiles }: WeightGraphProps) {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!weightLogs.length || !profiles.length) return;

    // Group logs by user
    const userLogs: Record<string, WeightLog[]> = {};
    weightLogs.forEach(log => {
      if (!userLogs[log.user_id]) {
        userLogs[log.user_id] = [];
      }
      userLogs[log.user_id].push(log);
    });

    // Sort logs by date for each user
    Object.keys(userLogs).forEach(userId => {
      userLogs[userId].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });

    // Get all unique dates
    const allDates = Array.from(new Set(weightLogs.map(log => 
      new Date(log.created_at).toLocaleDateString()
    ))).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // Create datasets for each user
    const datasets = Object.keys(userLogs).map((userId, index) => {
      const profile = profiles.find(p => p.id === userId);
      const userName = profile ? profile.full_name : `User ${index + 1}`;
      
      // Generate a color based on index with improved aesthetics
      const hue = (index * 137.5) % 360; // Golden angle for better distribution
      const saturation = 75 + (index % 3) * 5; // Slight variation in saturation
      const lightness = 55 + (index % 4) * 3; // Slight variation in lightness
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      
      return {
        label: userName,
        data: userLogs[userId].map(log => log.status),
        borderColor: color,
        backgroundColor: `${color}20`, // More subtle transparency
        borderWidth: 2,
        tension: 0.4, // Smoother curves
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
        pointHitRadius: 10, // Easier to hover
      };
    });

    setChartData({
      labels: allDates,
      datasets,
    });
  }, [weightLogs, profiles]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 10,
          boxWidth: 10,
          font: {
            size: 12,
            weight: '600' as const,
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        cornerRadius: 6,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} kg`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Weight (kg)',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          padding: { bottom: 10 }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          precision: 1,
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          padding: { top: 10 }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        }
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  if (!weightLogs.length) {
    return (
      <div className="flex items-center justify-center h-80 bg-black bg-opacity-20 rounded-lg border border-gray-700">
        <p className="text-gray-300 text-lg font-medium">No weight data available for the group members.</p>
      </div>
    );
  }

  return (
    <div className="h-80 p-2 bg-black bg-opacity-10 rounded-lg border border-gray-800 shadow-inner">
      <Line data={chartData} options={options as any} />
    </div>
  );
}