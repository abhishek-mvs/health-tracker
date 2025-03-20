'use client';

import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';

type WeightLog = {
  id: string;
  user_id: string;
  status: number;
  created_at: string;
};

export default function WeightLogsTable({ weightLogs }: { weightLogs: WeightLog[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (logId: string) => {
    if (!confirm('Are you sure you want to delete this weight log?')) {
      return;
    }

    setLoading(logId);
    setError(null);

    try {
      const { error } = await supabase
        .from('userWeightLog')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      
      // Refresh the page to show updated data
      router.refresh();
    } catch (err: any) {
      console.error('Error deleting weight log:', err);
      setError(err.message || 'Failed to delete weight log');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      {error && <p className="text-red-400 mb-2">{error}</p>}
      
      {weightLogs && weightLogs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Date</th>
                <th className="text-right py-2">Weight (kg)</th>
                <th className="text-right py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {weightLogs.map(log => (
                <tr key={log.id} className="border-b border-gray-800">
                  <td className="py-2">
                    {new Date(log.created_at).toLocaleDateString()}
                  </td>
                  <td className="text-right py-2">{log.status}</td>
                  <td className="text-right py-2">
                    <button
                      onClick={() => handleDelete(log.id)}
                      disabled={loading === log.id}
                      className="text-red-400 hover:text-red-300 focus:outline-none"
                      title="Delete weight log"
                    >
                      {loading === log.id ? 'Deleting...' : '🗑️'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No weight logs found. Start tracking your weight!</p>
      )}
    </>
  );
} 