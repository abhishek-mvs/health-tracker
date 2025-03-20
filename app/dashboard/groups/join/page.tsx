'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function JoinGroupPage() {
  const [groupId, setGroupId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      // Check if group exists
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('id')
        .eq('id', groupId)
        .single();

      if (groupError) throw new Error('Group not found');

      // Check if user is already a member
      const { data: existingMembership, error: membershipError } = await supabase
        .from('groupMembers')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', userData.user.id)
        .single();

      if (existingMembership) {
        throw new Error('You are already a member of this group');
      }

      // Add user to group
      const { error: joinError } = await supabase
        .from('groupMembers')
        .insert({
          group_id: groupId,
          user_id: userData.user.id,
        });

      if (joinError) throw joinError;

      router.push(`/dashboard/groups/${groupId}`);
    } catch (err: any) {
      console.error('Error joining group:', err);
      setError(err.message || 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto glass p-6">
      <h1 className="text-2xl font-bold mb-6">Join a Group</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Group ID</label>
          <input
            type="text"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            required
            className="w-full p-2 rounded bg-black bg-opacity-50 border border-gray-600"
            placeholder="Enter the group ID"
          />
        </div>
        
        {error && <p className="text-red-400">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          {loading ? 'Joining...' : 'Join Group'}
        </button>
      </form>
    </div>
  );
} 