'use client';

import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';

export default function CreateGroupPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      // Create the group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          title,
          description,
          created_by: userData.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as a member
      const { error: memberError } = await supabase
        .from('groupMembers')
        .insert({
          group_id: group.id,
          user_id: userData.user.id,
          created_at: new Date().toISOString(),
        });

      if (memberError) throw memberError;

      router.push(`/dashboard/groups/${group.id}`);
    } catch (err: any) {
      console.error('Error creating group:', err);
      setError(err.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto glass p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Create a New Group</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Group Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 rounded bg-black bg-opacity-50 border border-gray-600 focus:border-green-500 focus:outline-none"
            placeholder="Enter a name for your group"
          />
        </div>
        
        <div>
          <label className="block mb-2">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-2 rounded bg-black bg-opacity-50 border border-gray-600 focus:border-green-500 focus:outline-none"
            placeholder="Describe the purpose of your group"
          />
        </div>
        
        {error && <p className="text-red-400">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded transition-colors"
        >
          {loading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
} 