'use client'
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import date adapter for time scale

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale // Register TimeScale
);

// Define a more specific type for the logs
type StepsLog = {
  id: string;
  user_id: string;
  steps: number | null;
  log_date: string;
  created_at: string;
};

type Profile = {
  id: string;
  full_name: string;
  avatar_url?: string;
};

function StepsGraph({ 
  logs, 
  profiles = [] 
}: { 
  logs: StepsLog[]; 
  profiles?: Profile[] 
}) {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!logs.length || !profiles.length) return;

    // Group logs by user
    const userLogs: Record<string, StepsLog[]> = {};
    logs.forEach(log => {
      if (log.steps) { // Only include logs with steps data
        if (!userLogs[log.user_id]) {
          userLogs[log.user_id] = [];
        }
        userLogs[log.user_id].push(log);
      }
    });

    // Sort logs by date for each user
    Object.keys(userLogs).forEach(userId => {
      userLogs[userId].sort((a, b) =>
        new Date(a.log_date).getTime() - new Date(b.log_date).getTime()
      );
    });

    // Create datasets for each user with their own dates
    const datasets = Object.keys(userLogs).map((userId, index) => {
      const profile = profiles.find(p => p.id === userId);
      const userName = profile ? profile.full_name : `User ${index + 1}`;
      
      // Generate a color based on index with improved aesthetics
      const hue = (index * 137.5) % 360; // Golden angle for better distribution
      const saturation = 75 + (index % 3) * 5; // Slight variation in saturation
      const lightness = 45 + (index % 4) * 3; // Darker for better visibility on light backgrounds
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      return {
        label: userName,
        data: userLogs[userId].map((log) => {
          // Create date without time component
          const dateStr = log.log_date.split('T')[0];
          return {
            x: new Date(dateStr),
            y: log.steps,  
            originalDate: log.log_date // Store original date for tooltip
          };
        }),
        borderColor: color,
        backgroundColor: `${color}20`, // More subtle transparency
        borderWidth: 2.5, // Slightly thicker line for visibility
        tension: 0.4, // Smoother curves
        pointRadius: 5, // Slightly larger points
        pointHoverRadius: 8,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
        pointHitRadius: 10, // Easier to hover
        spanGaps: true, // Skip null values
      };
    });

    // Get all unique dates for x-axis (without time component)
    const allDates = Array.from(new Set(logs.map(log => {
      const dateStr = log.log_date.split('T')[0];
      return new Date(dateStr);
    }))).sort((a, b) => a.getTime() - b.getTime());

    setChartData({
      labels: allDates,
      datasets,
    });
  }, [logs, profiles]);

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
          },
          color: '#581c87' // Purple 900 for better visibility
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(88, 28, 135, 0.8)', // Purple background
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
          title: function(tooltipItems: any) {
            // Get the actual data point that includes our originalDate
            const dataPoint = tooltipItems[0].dataset.data[tooltipItems[0].dataIndex];
            
            // Use the original log_date for more accurate display
            if (dataPoint && dataPoint.originalDate) {
              const date = new Date(dataPoint.originalDate);
              return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
            }
            
            // Fallback to parsed x value if originalDate is not available
            const date = new Date(tooltipItems[0].parsed.x);
            return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          },
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} steps`;
          },
          // Filter out items that don't have data at this exact point
          filter: function(tooltipItem: any) {
            return tooltipItem.raw !== null && tooltipItem.raw !== undefined;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Steps',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          color: '#581c87', // Purple 900
          padding: { bottom: 10 }
        },
        grid: {
          color: 'rgba(147, 51, 234, 0.15)', // Purple 600 with transparency
        },
        ticks: {
          color: '#7e22ce' // Purple 700
        }
      },
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM d'
          },
          tooltipFormat: 'MMM d, yyyy' // Format for tooltip
        },
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          color: '#581c87', // Purple 900
          padding: { top: 10 }
        },
        grid: {
          color: 'rgba(147, 51, 234, 0.1)', // Purple 600 with transparency
        },
        ticks: {
          color: '#7e22ce' // Purple 700
        }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      intersect: true,
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  if (!logs.length) {
    return (
      <div className="flex items-center justify-center h-80 bg-transparent">
        <p className="text-purple-800 text-lg font-medium">No steps data available for the group members.</p>
      </div>
    );
  }

  return (
    <div className="h-80 p-4 rounded-lg shadow-inner bg-transparent">
      <Line data={chartData} options={options as any} />
    </div>
  );
}

export default StepsGraph; 