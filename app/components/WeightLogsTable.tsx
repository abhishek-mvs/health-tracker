'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/contexts/SupabaseContext';
import { toast } from 'react-hot-toast';
import { XIcon } from '@/components/ui/x';

type WeightLog = {
  id: string;
  user_id: string;
  weight: number;
  log_date: string;
  steps?: number;
  created_at?: string;
};

export default function WeightLogsTable({ weightLogs }: { weightLogs: WeightLog[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const { supabase } = useSupabase();

  const handleDelete = async (logId: string) => {
    if (!confirm('Are you sure you want to delete this health log?')) {
      return;
    }

    setLoading(logId);

    try {
      const { error } = await supabase
        .from('userHealthLog')
        .delete()
        .eq('id', logId);

      if (error) throw error;

      toast.success('Log deleted successfully');
      // Refresh the page to show updated data
      router.refresh();
    } catch (err: any) {
      console.error('Error deleting health log:', err);
      toast.error(err.message || 'Failed to delete health log');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-xl font-semibold p-4 border-b">Your Health Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weight (kg)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Steps
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {weightLogs.length > 0 ? (
              weightLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.log_date || log.created_at || '').toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.weight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.steps || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDelete(log.id)}
                      disabled={loading === log.id}
                      className="text-rose-400 hover:text-rose-500 focus:outline-none"
                      title="Delete health log"
                    >
                      {loading === log.id ? (
                        <span className="text-sm">Deleting...</span>
                      ) : (
                        <XIcon size={16} className="hover:bg-rose-50 p-1 rounded" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No health logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 