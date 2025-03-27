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
      <h2 className="text-xl font-semibold p-2 border-b">Your Health Logs</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-200">
              <th className="w-12"></th>
              <th className="text-left py-2 text-purple-900">Date</th>
              <th className="text-right py-2 pr-2 text-purple-900">Weight (kg)</th>
            </tr>
          </thead>
          <tbody>
            {weightLogs.map(log => (
              <tr key={log.id} className="border-b border-purple-100">
                <td className="w-12">
                  <button
                    onClick={() => handleDelete(log.id)}
                    disabled={loading === log.id}
                    className="text-rose-400 hover:text-rose-500 focus:outline-none"
                    title="Delete weight log"
                  >
                    {loading === log.id ? (
                      <span className="text-sm">...</span>
                    ) : (
                      <XIcon size={16} className="hover:bg-rose-50" />
                    )}
                  </button>
                </td>
                <td className="py-2 text-purple-800">
                  <span className="sm:hidden">{log.created_at ? new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}</span>
                  <span className="hidden sm:inline">{log.created_at ? new Date(log.created_at).toLocaleDateString() : '-'}</span>
                </td>
                <td className="text-right py-2 pr-2 text-purple-800">{log.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 