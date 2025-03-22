'use client';

import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';
import { XIcon } from '@/components/ui/x';

type WeightLog = {
  id: string;
  user_id: string;
  weight: number;
  log_date: string;
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
        .from('userHealthLog')
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
      {error && <p className="text-rose-500 bg-rose-100 p-2 rounded-lg mb-2">{error}</p>}

      {weightLogs && weightLogs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-200">
                <th className="w-12"></th>
                <th className="text-left py-2 text-purple-900">Date</th>
                <th className="text-right py-2 text-purple-900">Kg</th>
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
                    {new Date(log.log_date).toLocaleDateString()}
                  </td>
                  <td className="text-right py-2 text-purple-800">{log.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-purple-800">No weight logs found. Start tracking your weight!</p>
      )}
    </>
  );
} 