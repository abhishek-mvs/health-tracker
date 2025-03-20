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
      
      // Generate a color based on index
      const hue = (index * 137) % 360; // Golden angle approximation for good distribution
      const color = `hsl(${hue}, 70%, 60%)`;
      
      return {
        label: userName,
        data: userLogs[userId].map(log => log.status),
        borderColor: color,
        backgroundColor: `${color}33`, // Add transparency
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
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
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} kg`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Weight (kg)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  if (!weightLogs.length) {
    return <p>No weight data available for the group members.</p>;
  }

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
} 