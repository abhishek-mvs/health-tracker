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
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
    if (logs && logs.length > 0) {
      // Get all unique dates from logs
      const allDates = logs.map(log => 
        new Date(log.log_date || log.created_at).toLocaleDateString()
      );
      const uniqueDates = Array.from(new Set(allDates)).sort((a, b) => 
        new Date(a).getTime() - new Date(b).getTime()
      );

      // If profiles are provided, create a dataset for each user
      if (profiles && profiles.length > 0) {
        // Generate random colors for each user
        const colors = profiles.map(() => {
          const r = Math.floor(Math.random() * 255);
          const g = Math.floor(Math.random() * 255);
          const b = Math.floor(Math.random() * 255);
          return `rgb(${r}, ${g}, ${b})`;
        });

        // Create datasets for each user
        const datasets = profiles.map((profile, index) => {
          const userLogs = logs.filter(log => log.user_id === profile.id);
          
          // Map steps data to dates, excluding zero values
          const stepsData = uniqueDates.map(date => {
            const log = userLogs.find(log => 
              new Date(log.log_date || log.created_at).toLocaleDateString() === date
            );
            // Return null instead of 0 to skip plotting this point
            return (log?.steps && log.steps > 0) ? log.steps : null;
          });

          return {
            label: profile.full_name,
            data: stepsData,
            borderColor: colors[index],
            backgroundColor: colors[index].replace('rgb', 'rgba').replace(')', ', 0.5)'),
            tension: 0.1,
            spanGaps: true, // This allows the line to skip null values
          };
        });

        setChartData({
          labels: uniqueDates,
          datasets,
        });
      } else {
        // If no profiles, just show all steps data
        // Sort logs by date
        const sortedLogs = [...logs].sort(
          (a, b) => new Date(a.log_date || a.created_at).getTime() - new Date(b.log_date || b.created_at).getTime()
        );

        // Filter out logs with zero steps
        const nonZeroLogs = sortedLogs.filter(log => log.steps && log.steps > 0);

        // Extract dates and steps
        const dates = nonZeroLogs.map((log) =>
          new Date(log.log_date || log.created_at).toLocaleDateString()
        );
        const steps = nonZeroLogs.map((log) => log.steps || 0);

        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'Steps',
              data: steps,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              tension: 0.1,
            },
          ],
        });
      }
    }
  }, [logs, profiles]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Steps Progress',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} steps`;
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
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {logs && logs.length > 0 ? (
        <Line options={options} data={chartData} />
      ) : (
        <div className="text-center py-10 text-gray-500">No steps data available</div>
      )}
    </div>
  );
}

export default StepsGraph; 